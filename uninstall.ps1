# Run by the hub before it deletes the app folder: removes a harness installed outside the app folder (only one
# this app installed, recognised by its marker file). Research projects are never touched.
$ErrorActionPreference = 'Stop'
& node (Join-Path $PSScriptRoot 'scripts\install.js') --uninstall
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }
