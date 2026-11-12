# Frisbee Upload

Projektgrundlage für eine interaktive Upload-Animation.

## Gestaltung
Die beiden Bilder unter references/ dienen als visuelle Vorlage: heller grauer Hintergrund, weiße Uploadfläche mit gestrichelter Umrandung, dezente Schatten, klare Typografie und orange Akzente.

## Gewünschte Interaktion
1. Eine Datei auswählen oder in die Fläche ziehen.
2. Die Datei als greifbare Frisbee darstellen.
3. Durch Ziehen und Loslassen mit Maus oder Touch werfen; Richtung und Geschwindigkeit bestimmen den Flug.
4. Die Frisbee dreht sich und fliegt auf einer räumlich wirkenden Flugbahn zum Ziel.
5. Ein Frisbee-Ziel mit Ketten und Fangnetz ersetzt den Basketballkorb. Annahme: gemeint ist ein Discgolf-Ziel.
6. Bei einem Treffer reagiert das Netz, eine Bestätigung erscheint und der Dateizähler steigt.
7. Bei einem Fehlwurf kann erneut geworfen werden.

## Umfang des ersten Prototyps
Browserbasierte Animation mit lokaler Dateiauswahl, responsiver Darstellung und alternativer Bedienung per Schaltfläche. Ein tatsächlicher Server-Upload benötigt später ein festgelegtes Speicherziel; ein Treffer allein bestätigt keine Übertragung.

## Starten
`Start.cmd` doppelklicken oder `index.html` im Browser öffnen. Keine Installation erforderlich. Alternativ im Projektordner `node server.cjs` starten und http://127.0.0.1:4173 aufrufen.

## Bedienung
Dateien über die gestrichelte Fläche auswählen oder hineinziehen. Die orange Disc mit Maus oder Finger aufnehmen und mit Schwung zum Ziel bewegen und loslassen. Für einen automatischen Wurf „Probwurf“ wählen oder die Disc per Tab fokussieren und Enter bzw. Leertaste drücken. Bei mehreren Dateien wird pro Treffer eine Datei gezählt. Demo-Würfe erhöhen den Dateizähler nicht.

## Status
Webseite und Animation implementiert: responsive Oberfläche, Disc-Flug mit Rotation, Richtungsprüfung mit Fangtoleranz, Fehlwürfe, Kettenbewegung, Partikel und Dateiwarteschlange. Reduzierte Bewegung wird respektiert. Kein Backend und keine Dateiübertragung. Die Schrift wird optional von Google Fonts geladen; ohne Internet greifen lokale Ersatzschriften.

## Prüfung
JavaScript-Syntaxprüfung sowie isolierte Ablaufprüfung für Dateiauswahl, Treffer, Demo, Fehlwurf und Reset bestanden. Visuelle Browserprüfung in dieser Umgebung wegen gesperrter lokaler Verbindungen nicht möglich.
