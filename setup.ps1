# Installs the harness into HARNESS_DIR and writes its config.json from the install settings.
$ErrorActionPreference = 'Stop'
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8
& node (Join-Path $PSScriptRoot 'scripts\install.js')
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
