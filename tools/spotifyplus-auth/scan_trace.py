"""Scan a SmartInspect .sil trace for sensitive strings before sharing it.

Usage: python scan_trace.py <file.sil>
Prints counts per pattern with masked samples, plus counts of a few
diagnostic markers so you can see the file has the relevant content.
"""
import re
import sys
from collections import Counter
from pathlib import Path

path = Path(sys.argv[1])
data = path.read_bytes()

# printable runs: ASCII/UTF-8 and UTF-16LE (SmartInspect writes strings in both)
ascii_runs = re.findall(rb"[\x20-\x7e\x80-\xff]{6,}", data)
utf16_runs = [m.group(0).decode("utf-16-le", errors="ignore").encode() for m in re.finditer(rb"(?:[\x20-\x7e]\x00){6,}", data)]
runs = ascii_runs + utf16_runs
text = b"\n".join(runs).decode("utf-8", errors="ignore")

SENSITIVE = {
    "Bearer token": r"Bearer\s+[A-Za-z0-9._-]{20,}",
    "Spotify access token (BQ…)": r"\bBQ[A-Za-z0-9_-]{60,}",
    "access_token field": r"access[_-]?token['\"=: ]+[A-Za-z0-9._-]{20,}",
    "refresh_token field": r"refresh[_-]?token['\"=: ]+[A-Za-z0-9._-]{20,}",
    "client_secret": r"client[_-]?secret['\"=: ]+[A-Za-z0-9]{16,}",
    "sp_dc / sp_key cookie": r"\bsp_(dc|key)\b",
    "Authorization header": r"Authorization['\":= ]+",
    "email address": r"[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}",
    "password": r"password['\"=: ]+\S{4,}",
    "JWT": r"\beyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}",
    "public IP-like (non-RFC1918)": r"\b(?!10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|127\.|0\.|255\.)\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b",
}
DIAGNOSTIC = {
    "HostIpAddress": r"HostIpAddress",
    "update_cast / add_cast / remove_cast": r"\b(update_cast|add_cast|remove_cast)\b",
    "multizone": r"multizone",
    "Google-Cast-Group": r"Google-Cast-Group",
    "192.168.10.x mentions": r"192\.168\.10\.\d+",
    "Could not activate": r"Could not activate",
    "Failed to connect": r"Failed to connect",
}


def mask(s: str) -> str:
    return s[:12] + "…" + s[-4:] if len(s) > 20 else s[:4] + "…"


print(f"file: {path.name}  size: {len(data)/1e6:.1f} MB  string runs: {len(runs)}")
print("\n== sensitive patterns ==")
for label, pat in SENSITIVE.items():
    hits = re.findall(pat, text)
    hits = [h if isinstance(h, str) else h[0] for h in hits]
    uniq = Counter(hits)
    if not uniq:
        print(f"  none      {label}")
    else:
        sample = ", ".join(mask(k) for k in list(uniq)[:3])
        print(f"  {len(hits):>6}    {label}   e.g. {sample}")
print("\n== diagnostic content ==")
for label, pat in DIAGNOSTIC.items():
    n = len(re.findall(pat, text))
    print(f"  {n:>6}    {label}")
ips = Counter(re.findall(r"192\.168\.10\.\d+", text))
print("  LAN addresses seen:", ", ".join(f"{k}×{v}" for k, v in ips.most_common(8)))
