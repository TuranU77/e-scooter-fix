# E-Scooter Fix Hamburg

Statische Website für einen persönlichen E-Scooter-Service in Hamburg.

## Projektstatus

Die Website ist als lieferfähiger statischer One-Pager aufgebaut. Sie kann ohne Build-Schritt auf klassischem Webhosting, Netlify, Vercel Static Hosting oder ähnlichen Anbietern veröffentlicht werden.

Aktueller Arbeitsstand: heller, moderner One-Pager für **E-Scooter Fix Hamburg** mit plakativer Preisliste im Hero, Servicewegen `Vor Ort` und `Einschicken`, Servicekarten, Parallax-Bildtrennern, FAQ und zwei Popups:

- Service-/Preischeck-Popup
- Anfahrt-Popup mit Google-Maps-Embed für `Doormannsweg 21, Hamburg`

## Struktur

```text
.
├── index.html
├── impressum.html
├── datenschutz.html
├── assets/
│   ├── styles.css
│   ├── main.js
│   ├── icons/favicon.svg
│   ├── icons/scooter-logo.svg
│   └── images/
│       ├── bild_1.jpg
│       ├── bild_2.jpg
│       ├── bild_3.jpeg
│       └── scooter-cutout.png
└── docs/
    └── kunden-briefing.md
```

## Aktueller Seitenaufbau

- Header: zentriertes Scooter-Icon plus `E-Scooter Fix`; immer mit hellem Verlauf unter dem Logo, beim Scrollen stärker.
- Hero: Headline `E-Scooter Service Hamburg. Reifen & Service.`, Subline mit Vor-Ort/Paketdienst, drei Preis-Störer und drei Buttons.
- Hero-Buttons:
  - `WhatsApp schreiben`
  - `Preischeck starten`
  - `Reifenwechsel einsenden`
- Parallax-Bilder:
  - unter Hero: `bild_2.jpg`
  - zwischen Reifenservice und Service Shop: `bild_3.jpeg`
  - vor FAQ: `bild_1.jpg`
- Reifenservice: zwei Wege `Vor Ort` und `Einschicken`, beide mit Lime-Icons und Chip-Buttons.
- Service Shop: drei kompakte Karten ohne Icons:
  - Reifenwechsel: Lime, Bestseller
  - Inspektion: Violett, Check
  - Weitere Services: Schwarz, Anfrage
- FAQ: enthält auch den rechtlich wichtigen Leistungsumfang-Hinweis.

## Formular- und Popup-Logik

Die Popup-Logik liegt in `assets/main.js`.

### Preischeck

- Startet leer mit Modellauswahl.
- Bei gelistetem Modell wird der Festpreis `39 € Festpreis Montage` angezeigt.
- Danach erscheinen nur zwei Anschlussaktionen:
  - `Reifen einsenden`: wechselt direkt in das Einsendeformular und übernimmt das gewählte Modell.
  - `Anfahrt`: öffnet das Anfahrt-Popup.
- Bei `Keines der aufgelisteten Modelle` wird aus dem Preischeck eine Preisanfrage mit:
  - manuellem Modell
  - optionalem Foto
  - Name
  - E-Mail
  - Button `Preisanfrage versenden`

### Reifenwechsel einsenden

- Kann direkt über Hero, Serviceweg-Chip oder Preischeck-Festpreis gestartet werden.
- Bei gelistetem Modell werden Auftrag, Kontakt, Rücksendung, Summary und Druckbutton angezeigt.
- Required-Felder:
  - Modell
  - Leistung
  - Reifentyp
  - Name
  - E-Mail
  - Straße
  - Hausnummer
  - PLZ
  - Ort
- Druckfunktion: `Sendungszettel drucken`.
- Wichtig: Das Formular wird bei jedem Öffnen zurückgesetzt, damit Preischeck und Einsendeformular sich nicht gegenseitig Zustände vererben.

### Anfahrt

- Popup mit Google-Maps-Embed.
- Aktuelle Adresse: `Doormannsweg 21, Hamburg`.
- Route-Link:
  `https://www.google.com/maps/dir/?api=1&destination=Doormannsweg%2021%2C%20Hamburg`

## Gestaltungsstand

- Schrift: Google Font `Space Grotesk`.
- Grundlook: hell, Weiß als Primärfläche, Lime `#c6ff34`, Violet `#7e3bed`, Schwarz als Kontrast.
- Keine dunkle Primärfläche mehr.
- Keine Kartenform im Hero-Hintergrund.
- Parallax-Bildtrenner sind bewusst groß.
- Servicekarten sind farbige Karten, kompakt, ohne Icons.
- Badges/Störer in Servicekarten sitzen absolut oben rechts und sind bewusst klein.
- Logo-Icon ist ein echtes SVG-`img`, nicht mehr CSS-Maske, weil Safari/file:// Masken unzuverlässig zeigte.

## Wichtige Hinweise für Weiterarbeit

- Die CSS-Datei enthält viele ältere Iterationsregeln. Aktive Entscheidungen werden oft durch finale Overrides am Ende von `assets/styles.css` abgesichert.
- Beim Ändern bestehender Designs besser am Ende von `assets/styles.css` überschreiben, bis Zeit für CSS-Aufräumen ist.
- Cache-Buster in `index.html` nach CSS/JS-Änderungen aktualisieren.
- Browserprüfung über `http://localhost:8080/` ist zuverlässiger als `file://`, besonders bei JS, iframes und Cache.

## Vor Launch erledigen

- Formularversand technisch anbinden: aktuell bereitet das Formular nur Summary/Druck vor, es sendet noch nicht an ein Backend.
- Echte E-Mail-Adresse bestätigen oder ersetzen.
- WhatsApp-Link in `index.html` mit Dannys echter Mobilnummer ersetzen.
- Preisangaben final prüfen und ggf. mit Material-/Modellhinweisen ergänzen.
- Adresse `Doormannsweg 21, Hamburg` final bestätigen.
- Impressum mit vollständigen Betreiberangaben füllen.
- Datenschutzerklärung rechtlich finalisieren.
- Rechtliche Formulierung zum Leistungsumfang prüfen lassen.

## Lokale Vorschau

Da es eine statische Website ist, reicht ein einfacher lokaler Server:

```bash
python3 -m http.server 8080
```

Danach im Browser `http://localhost:8080` öffnen.
