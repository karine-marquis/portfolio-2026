Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_exact_card.png").FullName
$bmp = New-Object System.Drawing.Bitmap($imgPath)
$w = $bmp.Width
$h = $bmp.Height

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        $c = $bmp.GetPixel($x, $y)
        # Check if color is dark terracotta (R ~ 125-155, G ~ 45-75, B ~ 15-45)
        if ($c.R -ge 120 -and $c.R -le 165 -and $c.G -ge 40 -and $c.G -le 85 -and $c.B -ge 15 -and $c.B -le 50) {
            # Compute luminosity ratio to preserve anti-aliasing and gradients
            $factor = $c.R / 140.0
            $newR = [Math]::Min(255, [int](199 * $factor))
            $newG = [Math]::Min(255, [int](109 * $factor))
            $newB = [Math]::Min(255, [int](75 * $factor))
            $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $newR, $newG, $newB))
        }
    }
}

$bmp.Save("assets\mockup_lbc_exact_card_recolored.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Image recolored successfully from Canva dark terracotta to #C76D4B"
