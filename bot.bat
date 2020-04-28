@echo off
cls
echo Booting bot
title Bot WatchDog
:StartBot
start /wait node .
echo (%time%) Bot shutdown/crashed... restarting!
goto StartBot