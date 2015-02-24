@IF EXIST "%~dp0\node.exe" (
  "%~dp0\node.exe"  "%~dp0\..\commoner\bin\commonize" %*
) ELSE (
  node  "%~dp0\..\commoner\bin\commonize" %*
)