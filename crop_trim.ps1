Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_v2.png").FullName
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$w = $bmp.Width
$h = $bmp.Height

# Crop out the outer white padding around the card inside the image (approx 2.5% on each side)
$x = [int]($w * 0.02)
$y = [int]($h * 0.02)
$cropW = [int]($w * 0.96)
$cropH = [int]($h * 0.96)

$rect = New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)
$croppedBmp = $bmp.Clone($rect, $bmp.PixelFormat)
$croppedBmp.Save("assets\mockup_lbc_v2_trimmed.png", [System.Drawing.Imaging.ImageFormat]::Png)

$croppedBmp.Dispose()
$bmp.Dispose()
Write-Output "Trimmed white padding"
