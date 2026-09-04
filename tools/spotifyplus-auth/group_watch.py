"""Logs where a Google Cast group is hosted (leader address:port) whenever it changes.

Usage: python group_watch.py "All"   -> writes group-watch.log next to this file.
Useful when SpotifyPlus keeps a stale address for a group: the log shows whether
the group's leader actually moves (Google re-forming the group) or not.
"""
import socket
import sys
import time
from datetime import datetime
from pathlib import Path

from zeroconf import ServiceBrowser, ServiceListener, Zeroconf

GROUP = sys.argv[1] if len(sys.argv) > 1 else "All"
LOG = Path(__file__).with_name("group-watch.log")
TYPE = "_googlecast._tcp.local."


def log(msg: str) -> None:
    with LOG.open("a", encoding="utf-8") as f:
        f.write(f"{datetime.now():%Y-%m-%d %H:%M:%S}  {msg}\n")


class Listener(ServiceListener):
    def __init__(self) -> None:
        self.current: dict[str, str] = {}

    def _read(self, zc: Zeroconf, name: str) -> None:
        info = zc.get_service_info(TYPE, name, timeout=2000)
        if not info:
            return
        props = {k.decode(): v.decode(errors="replace") for k, v in info.properties.items() if v is not None}
        if props.get("fn") != GROUP:
            return
        where = f"{','.join(socket.inet_ntoa(a) for a in info.addresses)}:{info.port}"
        if self.current.get(name) != where:
            log(f"{GROUP} at {where}  (service {name.split('.')[0][:20]})")
            self.current[name] = where

    def add_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        self._read(zc, name)

    def update_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        self._read(zc, name)

    def remove_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        if name in self.current:
            log(f"{GROUP} record removed (was {self.current.pop(name)})")


log(f"watch started for group '{GROUP}'")
zc = Zeroconf()
ServiceBrowser(zc, TYPE, Listener())
try:
    while True:
        time.sleep(60)
except KeyboardInterrupt:
    zc.close()
