Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_exact_card.png").FullName
$bmp = [System.Drawing.Bitmap]::FromFile($imgPath)
$w = $bmp.Width
$h = $bmp.Height

# Target replacement: shift dark terracotta (#8C3B1E, RGB: 140, 59, 30) to (#C76D4B, RGB: 199, 109, 75)
# Delta offset: +59 R, +50 G, +45 B

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $pixel = $bmp.GetPixel($x, $x) # wait, x, y
    }
}
