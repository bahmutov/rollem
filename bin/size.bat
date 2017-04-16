@echo off 

cd ..

setlocal enableextensions

for /f "tokens=*" %%a in (
	'npm pack .'
) do (
	set t=%%a
)

wc -c %t%

rem tar -tvf archive.tar

rm %t%

endlocal