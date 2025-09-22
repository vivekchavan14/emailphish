# PhishMail Guard - Create Placeholder Icons
Write-Host "PhishMail Guard - Creating Placeholder Icons" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan

# Check if we can create simple icons using .NET
Add-Type -AssemblyName System.Drawing

try {
    # Define icon sizes
    $sizes = @(16, 32, 48, 128)
    
    foreach ($size in $sizes) {
        Write-Host "Creating icon${size}.png..." -ForegroundColor Yellow
        
        # Create a bitmap
        $bitmap = New-Object System.Drawing.Bitmap($size, $size)
        $graphics = [System.Drawing.Graphics]::FromImage($bitmap)
        
        # Set high quality
        $graphics.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
        
        # Create brushes and pens
        $blueBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(59, 130, 246))
        $whiteBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::White)
        $greenPen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(16, 185, 129), [Math]::Max(1, $size / 32))
        
        # Draw background circle
        $graphics.FillEllipse($blueBrush, 2, 2, $size - 4, $size - 4)
        
        # Draw shield shape (simplified)
        $shieldSize = [Math]::Max(4, $size * 0.6)
        $shieldX = ($size - $shieldSize) / 2
        $shieldY = $size * 0.2
        $graphics.FillEllipse($whiteBrush, $shieldX, $shieldY, $shieldSize, $shieldSize * 0.8)
        
        # Draw checkmark (simplified)
        if ($size -ge 32) {
            $checkSize = $size * 0.15
            $centerX = $size / 2
            $centerY = $size / 2
            $graphics.DrawLine($greenPen, $centerX - $checkSize, $centerY, $centerX - $checkSize/2, $centerY + $checkSize/2)
            $graphics.DrawLine($greenPen, $centerX - $checkSize/2, $centerY + $checkSize/2, $centerX + $checkSize, $centerY - $checkSize/2)
        }
        
        # Save the image
        $iconPath = "icons\icon${size}.png"
        $bitmap.Save($iconPath, [System.Drawing.Imaging.ImageFormat]::Png)
        
        # Cleanup
        $graphics.Dispose()
        $bitmap.Dispose()
        $blueBrush.Dispose()
        $whiteBrush.Dispose()
        $greenPen.Dispose()
        
        Write-Host "Created $iconPath" -ForegroundColor Green
    }
    
    Write-Host "`nAll placeholder icons created successfully!" -ForegroundColor Green
    
} catch {
    Write-Host "Error creating icons with .NET: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host "`nFallback: You'll need to create icons manually." -ForegroundColor Yellow
    Write-Host "Quick solution: Find any small PNG images and rename them to:" -ForegroundColor Yellow
    Write-Host "- icon16.png, icon32.png, icon48.png, icon128.png" -ForegroundColor Yellow
}

Write-Host "`n=== Next Steps ===" -ForegroundColor Cyan
Write-Host "1. Make sure your backend is running on port 8000" -ForegroundColor White
Write-Host "2. Open Chrome/Edge and go to chrome://extensions/" -ForegroundColor White
Write-Host "3. Enable 'Developer mode' (toggle in top right)" -ForegroundColor White
Write-Host "4. Click 'Load unpacked'" -ForegroundColor White
Write-Host "5. Select this folder: $(Get-Location)" -ForegroundColor White
Write-Host "`nPress any key to continue..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")