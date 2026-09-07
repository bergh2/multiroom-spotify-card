"""Redact secrets in a SmartInspect .sil trace with same-length overwrites.

Usage: python redact_trace.py <in.sil> <out.sil>
Keeps the binary layout intact (every replacement has the exact original length),
so the SmartInspect console can still open the file. Handles both ASCII/UTF-8 and
UTF-16LE encodings of the strings.
"""
import re
import sys
from pathlib import Path

src, dst = Path(sys.argv[1]), Path(sys.argv[2])
data = bytearray(src.read_bytes())

# (pattern, group to overwrite) — the group text is replaced by X of the same length
ASCII_RULES = [
    (rb"Bearer\s+(BQ[A-Za-z0-9._-]{20,})", 1),                       # OAuth bearer tokens
    (rb"\b(BQ[A-Za-z0-9._-]{60,})", 1),                                # Spotify access tokens
    (rb"\b(AQ[A-Za-z0-9._-]{60,})", 1),                                # Spotify refresh tokens
    (rb"(?i)access_token[\"' ]*[:=][\"' ]*([A-Za-z0-9._-]{16,})", 1),
    (rb"(?i)refresh_token[\"' ]*[:=][\"' ]*([A-Za-z0-9._-]{16,})", 1),
    (rb"(?i)client_secret[\"' ]*[:=][\"' ]*([A-Za-z0-9._-]{8,})", 1),
    (rb"(?i)client_id[\"' ]*[:=][\"' ]*([A-Za-z0-9]{32})", 1),
    (rb"(?i)password[\"' ]*[:=][\"' ]*([^\s\"',}]{3,})", 1),
    (rb"(?i)(sp_dc|sp_key)[\"' ]*[:=][\"' ]*([A-Za-z0-9._-]{8,})", 2),
    (rb"\b(eyJ[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{20,}\.[A-Za-z0-9_-]{10,})", 1),  # JWTs
    (rb"([A-Za-z0-9._%+-]+)@[A-Za-z0-9.-]+\.[A-Za-z]{2,}", 1),         # email local part
]


def x_same_len(m: re.Match, group: int) -> bytes:
    s, e = m.span(group)
    return m.group(0)[: s - m.start()] + b"x" * (e - s) + m.group(0)[e - m.start():]


def utf16(pat: bytes) -> bytes:
    """Rewrite an ASCII byte regex into its UTF-16LE equivalent (literal chars and classes get \\x00)."""
    out = bytearray()
    i = 0
    while i < len(pat):
        c = pat[i : i + 1]
        if c == b"\\":  # escape: \b \s \d etc. -> keep and add \x00 where it matches a char
            esc = pat[i : i + 2]
            i += 2
            if esc in (b"\\b",):
                out += esc
            else:
                out += esc + b"\x00"
            continue
        if c == b"[":  # character class ... ] followed by optional quantifier
            j = pat.index(b"]", i)
            cls = pat[i : j + 1]
            i = j + 1
            q = b""
            if i < len(pat) and pat[i : i + 1] in (b"*", b"+", b"?"):
                q = pat[i : i + 1]
                i += 1
            elif i < len(pat) and pat[i : i + 1] == b"{":
                k = pat.index(b"}", i)
                q = pat[i : k + 1]
                i = k + 1
            out += b"(?:" + cls + b"\x00)" + q
            continue
        if c == b"(":
            if pat[i : i + 3] == b"(?i":
                out += b"(?i)"
                i += 4
            else:
                out += c
                i += 1
            continue
        if c in (b")", b"|", b"*", b"+", b"?", b"{", b"}"):
            out += c
            i += 1
            continue
        out += c + b"\x00"
        i += 1
    return bytes(out)


def x_same_len_utf16(m: re.Match, group: int) -> bytes:
    s, e = m.span(group)
    n = (e - s) // 2
    return m.group(0)[: s - m.start()] + b"x\x00" * n + m.group(0)[e - m.start():]


total = 0
for pat, grp in ASCII_RULES:
    rx = re.compile(pat)
    count = 0
    def repl(m, grp=grp):
        global count
        count += 1
        return x_same_len(m, grp)
    data = bytearray(rx.sub(repl, bytes(data)))
    rx16 = re.compile(utf16(pat))
    def repl16(m, grp=grp):
        global count
        count += 1
        return x_same_len_utf16(m, grp)
    data = bytearray(rx16.sub(repl16, bytes(data)))
    total += count
    print(f"{count:>6}  {pat[:40].decode(errors='replace')}")

assert len(data) == src.stat().st_size, "size changed"
dst.write_bytes(bytes(data))
print(f"redactions: {total}; wrote {dst} ({len(data)/1e6:.1f} MB, same size as input)")
