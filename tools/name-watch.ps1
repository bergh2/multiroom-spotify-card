# Polls the local Cast setup API of one or more speakers and logs every name change.
# Usage: powershell -File tools\name-watch.ps1 -Ips 192.168.1.10,192.168.1.11
# Handy when a Google Home rename keeps reverting: the log shows the minute it flips.
param([string[]]$Ips = @())
if (-not $Ips.Count) { Write-Error 'Pass -Ips with one or more speaker addresses'; exit 1 }
$log = Join-Path $PSScriptRoot 'name-watch.log'
$devices = @{}
foreach ($ip in $Ips) { $devices[$ip] = '' }
Add-Content $log ("{0}  watch started" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'))
while ($true) {
  foreach ($ip in @($devices.Keys)) {
    try {
      $r = Invoke-RestMethod -Uri "http://${ip}:8008/setup/eureka_info?params=name,uptime" -TimeoutSec 5
      $name = [string]$r.name
      if ($name -ne $devices[$ip]) {
        Add-Content $log ("{0}  {1}  name='{2}'  uptime={3}h" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $ip, $name, [math]::Round($r.uptime / 3600, 1))
        $devices[$ip] = $name
      }
    } catch {
      Add-Content $log ("{0}  {1}  unreachable: {2}" -f (Get-Date -Format 'yyyy-MM-dd HH:mm:ss'), $ip, $_.Exception.Message)
      Start-Sleep -Seconds 30
    }
  }
  Start-Sleep -Seconds 60
}
