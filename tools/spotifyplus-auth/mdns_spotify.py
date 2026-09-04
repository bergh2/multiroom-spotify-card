import time, socket
from zeroconf import Zeroconf, ServiceBrowser, ServiceListener
found = {}
class L(ServiceListener):
    def add_service(self, zc, type_, name):
        info = zc.get_service_info(type_, name, timeout=2000)
        if not info: return
        props = {k.decode(): v.decode(errors="replace") for k, v in info.properties.items() if v is not None}
        addrs = [socket.inet_ntoa(a) for a in info.addresses]
        found[name] = (props.get("CPath") or name.split(".")[0], props.get("VERSION",""), addrs, info.port)
    def update_service(self, zc, type_, name): pass
    def remove_service(self, zc, type_, name): pass
zc = Zeroconf()
ServiceBrowser(zc, "_spotify-connect._tcp.local.", L())
time.sleep(8)
zc.close()
for name, (fn, md, addrs, port) in sorted(found.items(), key=lambda x: str(x[1][0])):
    print(f"{fn!s:20} {md!s:22} {','.join(addrs)}:{port}")
