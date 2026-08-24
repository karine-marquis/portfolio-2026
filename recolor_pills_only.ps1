Add-Type -AssemblyName System.Drawing
$imgPath = (Get-Item "assets\mockup_lbc_exact_card.png").FullName
$bmp = New-Object System.Drawing.Bitmap($imgPath)
$w = $bmp.Width
$h = $bmp.Height

# Target regions for pills and buttons:
# 1. Top left badge 'Le projet en détail': x [200..320], y [20..50]
# 2. Left sidebar active number '1': x [5..35], y [210..240]
# 3. Audio play button: x [285..325], y [760..800]
# 4. YouTube button: x [710..745], y [800..830]

for ($y = 0; $y -lt $h; $y++) {
    for ($x = 0; $x -lt $w; $x++) {
        # Only check regions outside the kitchen photo area (kitchen photo is x > 780, y < 400)
        if (!($x -gt 760 -and $y -lt 380)) {
            $c = $bmp.GetPixel($x, $y)
            # Match exact dark terracotta tone #8C3B1E (R 125-155, G 45-75, B 15-45)
            if ($c.R -ge 125 -and $c.R -le 155 -and $c.G -ge 45 -and $c.G -le 75 -and $c.B -ge 15 -and $c.B -le 45) {
                # Shift to exact #C76D4B (RGB: 199, 109, 75)
                $factor = $c.R / 140.0
                $newR = [Math]::Min(255, [int](199 * $factor))
                $newG = [Math]::Min(255, [int](109 * $factor))
                $newB = [Math]::Min(255, [int](75 * $factor))
                $bmp.SetPixel($x, $y, [System.Drawing.Color]::FromArgb($c.A, $newR, $newG, $newB))
            }
        }
    }
}

$bmp.Save("assets\mockup_lbc_exact_card_recolored.png", [System.Drawing.Imaging.ImageFormat]::Png)
$bmp.Dispose()
Write-Output "Recolored pills and buttons cleanly to #C76D4B"
