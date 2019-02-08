# PDOK locatie server viewer

Deze demo laat zien hoe de PDOK suggest en locate service gebruikt kunnen worden.

## Hoe te gebruiken

Download deze folder en open de `index.html` in je browser. De applicatie zou nu direct moeten werken! 


## Aanpassen van de JavaScript
De applicatie is gebouwd met NPM en Browserify om de packages te bundelen. De volgende packages zijn nodig:

* bloodhound-js
* leaflet
* leaflet-hash
* proj4
* proj4leaflet
* terraformer-wkt-parser
* typeahead.js

Run: 

```
npm install
browserify src/main.js > src/bundle.js
```
