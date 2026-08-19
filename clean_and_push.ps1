$git = "C:\Users\Capri\AppData\Local\GitHubDesktop\app-3.6.4\resources\app\git\cmd\git.exe"

Write-Output "1. Resetting heavy local commit..."
& $git reset HEAD~1

Write-Output "2. Removing heavy temp images and script files..."
Remove-Item -Path "crop_exact.ps1","crop_trim.ps1","recolor.ps1","recolor_pills_only.ps1","recolor_precise.ps1","assets\mockup_lbc_exact_card.png","assets\mockup_lbc_exact_card_recolored.png","assets\mockup_lbc_v2_trimmed.png" -Force -ErrorAction SilentlyContinue

Write-Output "3. Staging essential lightweight code files..."
& $git add index.html app.js styles.css data.js assets/lbc_hero_kitchen.png assets/lbc_sidebar_utensils.png assets/lbc_presentation_thumb.png assets/mockup_lbc_v2.png

Write-Output "4. Creating lightweight commit..."
& $git commit -m "feat(lbc-modal): refonte 2 colonnes Cordons Bleus (DS Japandi HTML/CSS)"

Write-Output "5. Pushing to GitHub..."
& $git push origin main
Write-Output "DONE_PUSH_SUCCESS"
