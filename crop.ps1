Add-Type -AssemblyName System.Drawing
$src = "C:\Users\Capri\Desktop\PF-26\Refonte_UX___Les_Cordons_Bleus.png"
$dest = "C:\Users\Capri\Desktop\PF-26\assets\PROJTS\CORDONS BLEUS\cordons_bleus_left_illustration.png"
$img = [System.Drawing.Bitmap]::FromFile($src)
$cropWidth = [int]($img.Width * 0.495)
$rect = New-Object System.Drawing.Rectangle(0, 0, $cropWidth, $img.Height)
$cropped = $img.Clone($rect, $img.PixelFormat)
$img.Dispose()
$cropped.Save($dest, [System.Drawing.Imaging.ImageFormat]::Png)
$cropped.Dispose()
Write-Host "CROP SUCCESSFUL!"
