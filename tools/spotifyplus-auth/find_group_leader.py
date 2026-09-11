"""Find the current leader (host:port) of a Google Cast speaker group.

Two variants, no pychromecast private functions:
  1. find_leader_public()  uses pychromecast.dial.get_multizone_status (public API)
  2. find_leader_raw()     talks to the setup API directly with urllib

Ask several members, not just one: right after a re-form a single member
can still claim to be the leader ("self") while it no longer is.
"""
from __future__ import annotations
import json
import socket
import ssl
import urllib.request
from collections import Counter
from uuid import UUID

from pychromecast.dial import get_multizone_status   # public


def _accepts_tcp(host: str, port: int, timeout: float = 1.5) -> bool:
    try:
        with socket.create_connection((host, port), timeout=timeout):
            return True
    except OSError:
        return False


def find_leader_public(group_uuid: UUID, member_hosts: list[str], timeout: float = 5) -> tuple[str, int] | None:
    """Ask each member for its multizone status; return (host, port) of the group leader."""
    votes: Counter[tuple[str, int | None]] = Counter()
    for host in member_hosts:
        status = get_multizone_status(host, timeout=timeout)   # https://host:8443/setup/eureka_info?params=multizone
        if status is None:
            continue
        for g in status.groups:
            if g.uuid == group_uuid and g.host:
                # leader answers with its own host + cast_port; followers answer with the
                # leader host and no port (pychromecast drops the :10001 multizone port)
                votes[(g.host, g.port)] += 1
    if not votes:
        return None
    # merge votes per host, prefer an entry that carries the port (the leader's own answer)
    by_host: Counter[str] = Counter()
    port_for: dict[str, int] = {}
    for (host, port), n in votes.items():
        by_host[host] += n
        if port:
            port_for[host] = port
    for host, _ in by_host.most_common():
        port = port_for.get(host)
        if port is None:
            # majority points at a host that did not answer itself; ask it directly
            st = get_multizone_status(host, timeout=timeout)
            for g in (st.groups if st else []):
                if g.uuid == group_uuid and g.host == host and g.port:
                    port = g.port
        if port and _accepts_tcp(host, port):
            return host, port
    return None


def find_leader_raw(group_uuid: str, member_hosts: list[str], timeout: float = 5) -> tuple[str, int] | None:
    """Same thing without pychromecast: raw setup API, elected_leader field."""
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE
    want = group_uuid.replace("-", "").lower()
    claims: Counter[str] = Counter()
    port_for: dict[str, int] = {}
    for host in member_hosts:
        try:
            with urllib.request.urlopen(f"https://{host}:8443/setup/eureka_info?params=multizone", timeout=timeout, context=ctx) as r:
                groups = json.load(r).get("multizone", {}).get("groups", [])
        except Exception:
            continue
        for g in groups:
            if g.get("uuid", "").replace("-", "").lower() != want:
                continue
            leader = g.get("elected_leader", "")
            if leader == "self":
                claims[host] += 1
                port_for[host] = int(g.get("cast_port", 0))
            elif ":" in leader:
                claims[leader.rsplit(":", 1)[0]] += 1
    for host, _ in claims.most_common():
        port = port_for.get(host)
        if port and _accepts_tcp(host, port):
            return host, port
    return None


if __name__ == "__main__":
    members = ["192.168.10.154", "192.168.10.51", "192.168.10.108", "192.168.10.110", "192.168.10.111", "192.168.10.69"]
    gid = "8e0e23c0-a435-45ba-9028-8c4b5dcf69ad"
    print("public API :", find_leader_public(UUID(gid), members))
    print("raw setup  :", find_leader_raw(gid, members))
