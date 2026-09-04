# Polls the local Cast setup API of the HK Citation speakers and logs every name change.
$log = Join-Path $PSScriptRoot 'name-watch.log'
$devices = @{ '192.168.10.69' = ''; '192.168.10.154' = '' }
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

