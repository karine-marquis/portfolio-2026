Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_v2.png").FullName
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
Write-Output "WIDTH: $($bmp.Width)"
Write-Output "HEIGHT: $($bmp.Height)"
$bmp.Dispose()
