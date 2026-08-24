Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_v2.png").FullName
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$w = $bmp.Width
$h = $bmp.Height

# Crop EXACTLY to the rounded card boundaries inside the canvas
# Left: 42px, Top: 36px, Width: 1318px, Height: 1050px
$x = 42
$y = 36
$cropW = 1318
$cropH = 1050

$rect = New-Object System.Drawing.Rectangle($x, $y, $cropW, $cropH)
$croppedBmp = $bmp.Clone($rect, $bmp.PixelFormat)
$croppedBmp.Save("assets\mockup_lbc_exact_card.png", [System.Drawing.Imaging.ImageFormat]::Png)

$croppedBmp.Dispose()
$bmp.Dispose()
Write-Output "Exact card cropped without white canvas margin"
