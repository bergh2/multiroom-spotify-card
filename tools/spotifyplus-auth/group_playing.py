"""Exit 0 when the Cast group (found by name via mDNS) is running the Spotify app, else exit 1.

Usage: python group_playing.py "All"
"""
import socket
import sys
import time

import pychromecast
from zeroconf import ServiceBrowser, ServiceListener, Zeroconf

GROUP = sys.argv[1] if len(sys.argv) > 1 else "All"
TYPE = "_googlecast._tcp.local."


class Finder(ServiceListener):
    def __init__(self) -> None:
        self.where: tuple[str, int] | None = None

    def add_service(self, zc: Zeroconf, type_: str, name: str) -> None:
        info = zc.get_service_info(type_, name, timeout=2000)
        if not info:
            return
        props = {k.decode(): v.decode(errors="replace") for k, v in info.properties.items() if v is not None}
        if props.get("fn") == GROUP and info.addresses:
            self.where = (socket.inet_ntoa(info.addresses[0]), info.port)

    def update_service(self, *a) -> None:  # noqa: D401
        pass

    def remove_service(self, *a) -> None:
        pass


zc = Zeroconf()
f = Finder()
ServiceBrowser(zc, TYPE, f)
for _ in range(20):
    if f.where:
        break
    time.sleep(0.5)
zc.close()
if not f.where:
    print("group not found")
    sys.exit(1)

host, port = f.where
try:
    cast = pychromecast.get_chromecast_from_host((host, port, None, None, GROUP), tries=1, timeout=10)
    cast.wait(timeout=10)
    app = cast.app_display_name or ""
    state = cast.media_controller.status.player_state if cast.media_controller.status else ""
    cast.disconnect()
    print(f"{GROUP}@{host}:{port} app={app!r} state={state}")
    sys.exit(0 if ("spotify" in app.lower() and state in ("PLAYING", "BUFFERING")) else 1)
except Exception as e:  # noqa: BLE001
    print(f"error: {e}")
    sys.exit(1)
