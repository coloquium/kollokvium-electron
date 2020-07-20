# Kollokvium-electron

## About

TDB

## Feature list  (current)

1. 1-many participants ( P2P Streams )
2. Instanet messages/Chat  (P2P DataChannels) 
3. Share files (P2P DataChannels)
4. Screen sharing, Chooose between tab's, windows or the desktop. (P2P Streams)
5. Random room generator or user-defined room names
6. No login and registration required
7. Multiple stream recording ( record the meeting or single participant ), Recording done locally.
8. Lock / unlock rooms
9. Subtitles / captions (Speech recognition)
10. Auto translate of Subtitles / captions ( from source to prefered language)
11. Picture-In-Picture support (renders all streams into PiP element)
12. Active speaker - Indication of who is talking
13. Active speaker view and grid view 
14. E2EE (Currently in test for canary/beta (will require Chrome 84+)

..and more

## Hotkeys aka keyboard shortcuts  

`ctrl-l` Request low resolution media streams from all connected participanyts.

`ctrl-r` Start / stop recording of meeting ( applies to recoring of everyone participating)

`ctrl-g`  Toogle active-speaker vide / grid view (default).

`ctrl-m`  Mute / un-mute microphone.

`ctrl-v`  Mute / un-mute camera.

`ctrl+q`  Mute / un-mute all audio.

`ctrl+s`  Enable / disable subtitles (captions).

`ctrl+i`  Hide / show chat & fileshare window.

`ctrl-u` Get statistics for each RTCPeerConnection. Generate 1-n HTML based reports that is passedf back to client as downloadable files.

`ctrl-b` Start/stop recording of each stream individually. 


## Install & build

This repo used the offical kollokvium.se backend ( signaling etc.)    You can mofify settings.json if you want another configuration ( before build )

### Step 0

Clone the repository


### Step 1 

Make sure you got electron-builder CLI installed so you can run build

`npm insall electron-builder -g`

###  Step 2

Install dependencies.

`npm install` 

#### Note

Yoy may need to run `npm run postinstall` also

### Step 3

Build

`npm run build`


### Step 4

Create electron packages.    Outputs to `/release/`


### Step 5

Run the application from `/release/`



## Other






Regards
    Team Kollokvium (colloquium)
 
