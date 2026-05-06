# Portfolio-video’s voor web (hoge kwaliteit)

## Home + My Work catalogus — **compact maar scherp**

Alle MP4‑paden uit `homepage.json` en `work-page.json` in één keer hercoderen naar een klein maar heel net web‑resultaat:

| Onderdeel | `encode-home-work-catalog.sh` | Waarom |
|-----------|---------------------------------|--------|
| Video | H.264 **CRF 22**, preset **slower** | Kleiner dan CRF‑18‑workflow; op telefoons/laptops nog steeds ijzersterk. |
| Resolutie | Max **1080×1920** | Standaard reels‑maat (geen gigantische bron meer). |
| Geluid | **AAC 160k** stereo | Ruim voor “Sound on”; compacter dan 192k. |
| Stream | **faststart** | Startsnelheid zoals nu. |

```bash
brew install ffmpeg
cd "/pad/naar/irisonthemove"
./scripts/encode-home-work-catalog.sh
NEW_V=YYYYMMDD ./scripts/bump-video-version-in-json.sh   # bv. NEW_V=20260507 — daarna committen én pushen
```

Het script slaat elk origineel op als `*.pre-web-reencode.bak`; verwijder die pas als je akkoord bent.

Ontbreken er bestanden onder `public/…`, dan print het script daar een waarschuwing voor (plaats die MP4’s eerst, of werk JSON bij).

Wil je nog iets meer compressie tegen licht hoger risico?

```bash
CRF=23 PRESET=slow ./scripts/encode-home-work-catalog.sh
```

Wil je hogere maximale pixels (minder compressie bij grote desktops):

```bash
MAX_W=1440 MAX_H=2560 CRF=22 ./scripts/encode-home-work-catalog.sh
```

## Standaard (“beste” instelling — hele boom `public/videos`)

`encode-web-reels.sh` staat nu op **zeer hoge kwaliteit**:

| Onderdeel | Standaard | Waarom |
|----------|-----------|--------|
| **Video** | H.264 **CRF 18** | Onder 18 wordt het bestand snel veel groter; 18 is voor web nog “top” zonder onnodige ballast. |
| **Preset** | **slower** | Per stap trager dan `slow`, maar betere bits voor dezelfde kwaliteit (kleinere file óf scherper beeld). |
| **Resolutie** | Max **1440×2560** | Scherp op grote telefoons; 4K-bron wordt verkleind, 1080×1920 blijft zo (geen opschaling). |
| **Geluid** | **AAC 192 kbps** | Duidelijk beter dan 128k voor muziek en rijk geluid. |
| **Streaming** | **faststart** | `moov` vooraan voor snel afspelen op de site. |

Handmatig **nog extremer** (veel langere encode):

```bash
PRESET=veryslow ./scripts/encode-web-reels.sh
```

Kleiner / sneller encoderen (bewust iets minder kwaliteit):

```bash
CRF=20 PRESET=slow ./scripts/encode-web-reels.sh
```

## Gebruik

```bash
brew install ffmpeg
cd "/Users/irisjorna/Desktop/Iris On The Move/WEBSITE/irisonthemove"
./scripts/encode-web-reels.sh
```

Daarna in `homepage.json` / `work-page.json` een **nieuwe gedeelde `?v=`** zetten.

## Realistische verwachting

Lengte en complexiteit van de clip bepalen nog steeds de bestandsgrootte — maar **alle clips delen nu dezelfde hoge lat**.
