"""Reboot a Google Cast device through its local setup API.

Usage:  python reboot_cast.py <ip> [--info]

  --info   only print name/uptime/version, do not reboot

The reboot endpoint is the one the Google Home app uses. Google's own
devices stopped accepting it unauthenticated in 2019 (they answer 403);
third-party "Chromecast built-in" speakers such as the Harman Kardon
Citation series often still do. If both ports answer 403 or time out,
power-cycle the speaker by hand.
"""
import json
import sys
import urllib.request
import ssl

ip = sys.argv[1] if len(sys.argv) > 1 else None
if not ip:
    print(__doc__)
    sys.exit(2)
info_only = "--info" in sys.argv

ctx = ssl.create_default_context()
ctx.check_hostname = False
ctx.verify_mode = ssl.CERT_NONE


def call(url, data=None):
    req = urllib.request.Request(url, data=data, method="POST" if data else "GET")
    if data:
        req.add_header("Content-Type", "application/json")
    with urllib.request.urlopen(req, timeout=6, context=ctx) as r:
        return r.status, r.read().decode("utf-8", "ignore")


for base in (f"http://{ip}:8008", f"https://{ip}:8443"):
    try:
        st, body = call(f"{base}/setup/eureka_info?params=name,uptime,build_version,cast_build_revision")
        d = json.loads(body) if body.strip().startswith("{") else {}
        print(f"{base}: {d.get('name')}  uptime {d.get('uptime', 0)/3600:.1f} h  build {d.get('build_version')}")
        break
    except Exception as e:  # noqa: BLE001
        print(f"{base}: info failed: {e}")

if info_only:
    sys.exit(0)

for base in (f"http://{ip}:8008", f"https://{ip}:8443"):
    try:
        st, body = call(f"{base}/setup/reboot", data=json.dumps({"params": "now"}).encode())
        print(f"{base}/setup/reboot -> HTTP {st}. Reboot requested; the speaker is back in about a minute.")
        sys.exit(0)
    except urllib.error.HTTPError as e:
        print(f"{base}/setup/reboot -> HTTP {e.code} ({'not allowed on this firmware' if e.code in (403, 401) else e.reason})")
    except Exception as e:  # noqa: BLE001
        print(f"{base}/setup/reboot -> {e}")

print("Remote reboot refused. Power-cycle the speaker by hand.")
sys.exit(1)
