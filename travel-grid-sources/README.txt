Travel guides raster (Work-pagina) — 6 bronbestanden voor import

VOLGORDE = wat je op een rijtje hebt gestuurd: 1 = linksboven … 6 = rechtsonder (2 rijen × 3).

Stap A — kopieëren naar deze map (geen spaties in de naam nodig):

  travel-grid-sources/01.*  → jouw eerste video (MOV of MP4)
  travel-grid-sources/02.*  → tweede
  ...
  travel-grid-sources/06.*  → zesde

Het bestandslabel mag bv. zijn: 01.mov / 02.mp4 / 06.mp4 (één match per nummer).

Stap B — in de project-root in Terminal:

  npm run import-travel-grid

Daarna verschijnen: public/videos/work/travel/travel-guide-grid-01.mp4 … grid-06.mp4

Wil je géén lokale map gebruiken? Zet bronnen dan nog steeds zo in Downloads onder de namen waar het script op zoekt (zie scripts/import-travel-guide-grid-six.sh).
