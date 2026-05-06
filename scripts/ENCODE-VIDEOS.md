# Portfolio-video’s voor web (hoge kwaliteit)

## Standaard (“beste” instelling in het script)

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
