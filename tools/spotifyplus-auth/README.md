# SpotifyPlus desktop token helper

SpotifyPlus needs a "Spotify Desktop Player" token to wake idle Chromecasts.
The token is created once with a script from the SpotifyPlus author:

1. Install Python 3.11+ and run, in this folder:

   ```bash
   python -m venv .venv
   .venv/Scripts/pip install spotifywebapipython lxml
   ```

   If Windows "Smart App Control" blocks the compiled zeroconf module, install a
   pure-Python build instead: `SKIP_CYTHON=1 .venv/Scripts/pip install --no-binary zeroconf --force-reinstall zeroconf`.

2. Download the latest `AuthTokenGenerator.py` from
   https://github.com/thlucas1/SpotifyWebApiPython/blob/master/docs/include/samplecode/ZeroconfConnect/AuthTokenGenerator.py
   into this folder and run `.venv/Scripts/python AuthTokenGenerator.py`. Answer `y`, log in to Spotify in the browser window and approve.

3. Copy the resulting `spotifyplus_tokens.json` to `<config>/.storage/` on your Home Assistant. No restart needed.

`mdns_cast.py` lists the Google Cast devices and groups on your network with the
address they currently advertise. Useful when SpotifyPlus reports "failed to connect"
to a group: compare its address with what mDNS says.
