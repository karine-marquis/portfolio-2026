Add-Type -AssemblyName System.Speech
try {
    $culture = New-Object System.Globalization.CultureInfo("fr-FR")
    $engine = New-Object System.Speech.Recognition.SpeechRecognitionEngine($culture)
    $grammar = New-Object System.Speech.Recognition.DictationGrammar
    $engine.LoadGrammar($grammar)
    $engine.SetInputToWaveFile("C:\Users\Capri\Desktop\portfolio-2026\assets\podcasts\foodles_audio.wav")
    
    $sb = New-Object System.Text.StringBuilder
    while ($true) {
        $result = $engine.Recognize()
        if ($null -eq $result) { break }
        [void]$sb.AppendLine($result.Text)
    }
    $text = $sb.ToString()
    Set-Content -Path "C:\Users\Capri\Desktop\portfolio-2026\assets\foodles-canva-version-textuelle-accessible.txt" -Value $text -Encoding UTF8
    Write-Host "Transcribed text length: $($text.Length)"
} catch {
    Write-Host "Speech recognition error: $_"
}
