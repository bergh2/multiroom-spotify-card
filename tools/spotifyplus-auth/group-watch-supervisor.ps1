# Keeps group_watch.py running; restarts it if it exits (e.g. after a network drop).
$dir = Split-Path -Parent $MyInvocation.MyCommand.Path
while ($true) {
  & "$dir\.venv\Scripts\python.exe" "$dir\group_watch.py" "All"
  Add-Content "$dir\group-watch.log" ("{0}  watcher exited, restarting in 30 s" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
  Start-Sleep -Seconds 30
}
