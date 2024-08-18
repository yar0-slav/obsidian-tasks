[CmdletBinding()]
param (
    [Parameter(HelpMessage = 'The path to the plugins folder uner the .obsidian directory.')]
    [String]
    $ObsidianPluginRoot = "D:\Projects\Coding\obsidian-tasks\resources\sample_vaults\Tasks-Demo\.obsidian\plugins\",
    [Parameter(HelpMessage = 'The folder name of the plugin to copy the files to.')]
    [String]
    $PluginFolderName = 'obsidian-tasks-plugin'
)

$envFilePath = Join-Path -Path $PSScriptRoot -ChildPath '../.env'
if (Test-Path -Path $envFilePath) {
    Get-Content -Path $envFilePath | ForEach-Object {
        if ($_ -match '^\s*#' -or $_ -match '^\s*$') { return }
        $parts = $_ -split '=', 2
        $key = $parts[0].Trim()
        $value = $parts[1].Trim()
        [System.Environment]::SetEnvironmentVariable($key, $value)
    }
} else {
    Write-Error "The .env file was not found at $envFilePath"
}

$repoRoot = (Resolve-Path -Path $(git rev-parse --show-toplevel)).Path

if (-not (Test-Path $ObsidianPluginRoot)) {
    Write-Error "Obsidian plugin root not found: $ObsidianPluginRoot"
    return
} else {
    Write-Host "Obsidian plugin root found: $ObsidianPluginRoot"
}

Push-Location $repoRoot
Write-Host "Repo root: $repoRoot"

yarn run build:dev

if ($?) {

    Write-Output 'Build successful'

    $filesToLink = @('main.js', 'styles.css', 'manifest.json')

    foreach ($file in $filesToLink ) {
        if ((Get-Item "$ObsidianPluginRoot/$PluginFolderName/$file" ).LinkType -ne 'SymbolicLink') {
            Write-Output "Removing $file from plugin folder and linking"
            Remove-Item "$ObsidianPluginRoot/$PluginFolderName/$file" -Force
            New-Item -ItemType SymbolicLink -Path "$ObsidianPluginRoot/$PluginFolderName/$file" -Target "$repoRoot/$file"
        } else {
            (Get-Item "$ObsidianPluginRoot/$PluginFolderName/$file" ).LinkType
        }
    }

    $hasHotReload = Test-Path "$ObsidianPluginRoot/$PluginFolderName/.hotreload"

    if (!$hasHotReload) {
        Write-Output 'Creating hotreload file'
        '' | Set-Content "$ObsidianPluginRoot/$PluginFolderName/.hotreload"
    }

    yarn run dev

} else {
    Write-Error 'Build failed'
}

Pop-Location
