In de volgende oefeningen zijn we op zoek naar informatie over grote daken. Ook deze kaartlaag is opgenomen in de Zonnewijzer.   
 
De request URL is als volgt opgebouwd: `https://[URL Zonnewijzer service]/[laag ID]/[operation]`     

De URL van de Zonnewijzer is hetzelfde als in de vorige oefeningen:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer    

We willen een kaartlaag bevragen, niet wijzigen. Vandaar dat we voor `operation` opnieuw de waarde `query` kiezen.

Maar wat is het laag ID?    
Zoek in de service beschrijving naar de laag _Grote daken [meer dan 180 panelen]_ en noteer het laag ID. 

Je hebt nu alle informatie die nodig is om de request URL samen te stellen. Nu de juiste request parameters nog!    

Experimenteren met requests gaat eenvoudiger in Postman. Door te klikken op onderstaande knop, open je een collectie met alle requests uit deze workshop in Postman. Wel zo makkelijk! 

[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/72b27942624d611382e9#?env%5Bworkshop-web-api%5D=W3sia2V5Ijoiem9ubmV3aWp6ZXJfc2VydmljZSIsInZhbHVlIjoiaHR0cHM6Ly9nZW9zZXJ2aWNlcy56dWlkLWhvbGxhbmQubmwvYXJjZ2lzL3Jlc3Qvc2VydmljZXMvUnVpbXRlL1pvbm5ld2lqemVyL0ZlYXR1cmVTZXJ2ZXIiLCJkZXNjcmlwdGlvbiI6IiIsInR5cGUiOiJ0ZXh0IiwiZW5hYmxlZCI6dHJ1ZX1d)  
  
Raadpleeg de ArcGIS REST API documentatie voor [meer informatie over de beschikbare request parameters](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm#GUID-62EE7495-8688-4BD0-B433-89F7E4476673).

## Attribuutgegevens in JSON (zonder geometrie)

Request parameters:    

```
    where              1=1 	
    outFields          *
    returnGeometry     false
    f                  pjson	
```

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&outFields=*&f=pjson

Tot zo ver niets nieuws onder de zon. Of toch wel?    
Scroll naar het einde van het document dat de service retourneert. Daar zie je staan:

```
    "exceededTransferLimit": true
```

Merk bovendien op dat voor de laatste rij geldt: `OBJECTID = 1000`.

Er is een limiet aan het aantal rijen dat de service per request teruggeeft. In dit geval is dat 1.000.    
Het antwoord van de server bevat dus niet alle rijen in de dataset! Hoeveel rijen zijn er dan wel in totaal?   

## Aantal rijen in de dataset

Met de parameter `returnCountOnly` kun je het aantal rijen opvragen dat voldoet aan de query.

Request parameters:    

```
    where              1=1 	
    returnCountOnly    true
    f                  pjson	
```

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&returnCountOnly=true&f=pjson

Het zijn er bijna 20.000! Hoe kun je dan wel alle rijen opvragen?     
Dat doe je door _paginering_ toe te passen: je maakt meerdere requests, waarmee je steeds een ander deel van de dataset opvraagt, totdat je alles hebt.

## Paginering

Bij paginering maak je slim gebruik van de parameters `orderByFields`, `resultOffset` en `recordCount`.   

Met `orderByFields` sorteer je de rijen op `OBJECTID`. Dit is de standaardinstelling. Je kunt de parameter dus ook weglaten.    

Daarna geef je met `resultOffset` aan wat het volgnummer is van de eerste rij die opgehaald moet worden.    

Met `recordCount` specificeer je hoeveel rijen het request maximaal mag retourneren. Bij paginering is dit meestal gelijk aan het maximum aantal rijen dat de service retourneert.    

Request parameters:    

```
    where              1=1 	
    outFields          *
    returnGeometry     false
    orderByFields      OBJECTID
    resultOffset       1000
    recordCount        1000
    f                  pjson	
```

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&outFields=*&returnGeometry=false&orderByFields=OBJECTID&resultOffset=1000&recordCount=1000&f=pjson

Merk op dat voor de eerste rij in de response van de server geldt: `OBJECTID = 1001`.

## Grootste en kleinste oppervlakte van een dak 

Request parameters:    
```
    where              1=1
    outStatistics      [{"statisticType":"max",       
                         "onStatisticField":"oppervlakte",      
                         "outStatisticFieldName":"grootste_opp"},
                        {"statisticType":"min",       
                         "onStatisticField":"oppervlakte",      
                         "outStatisticFieldName":"kleinste_opp"}]
    f                  pjson
```	

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outStatistics=[{"statisticType":"max","onStatisticField":"oppervlakte","outStatisticFieldName":"grootste_opp"},{"statisticType":"min","onStatisticField":"oppervlakte","outStatisticFieldName":"kleinste_opp"}]&f=pjson

## Aantal grote daken per gemeente

Met de parameter `outStatistics` kun je aangeven dat je een telling (`count`) op een bepaald attribuut wilt. OBJECTID is een verplicht attribuut. Het is altijd gevuld en daarom geschikt om onze telling op te baseren.    

Door in `groupByFieldsForStatistics` het attribuut gemeentenaam op te nemen, geeft de service een telling per gemeente terug.     

Request parameters:    
```
    where                       1=1
    outStatistics               [{"statisticType":"count",       
                                  "onStatisticField":"OBJECTID",      
                                  "outStatisticFieldName":"aantal_grote_daken"}]
    groupByFieldsForStatistics  gemeentenaam				 
    f                           pjson
```	

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outStatistics=[{"statisticType":"count","onStatisticField":"OBJECTID","outStatisticFieldName":"aantal_grote_daken"}]&f=pjson

## Alle grote daken in de gemeente Alblasserdam 

Request parameters:    
```
    where                       1=1
    geometry                    {"rings": [[[103213.30700000003,431507.91699999943],[103126.35799999908,431607.27199999988],    
                                            ..., [103213.30700000003,431507.91699999943]]]}
    geometryType                esriGeometryPolygon
    inSR                        28992
    f                           geojson
```

Request:

[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&geometry={"rings": [[[103213.30700000003,431507.91699999943],[103126.35799999908,431607.27199999988],[102615.19000000134,432732.09800000116],[102779.94999999925,432792.05999999866],[103345.83399999887,432239.02820000052],[103681.84600000083,432661.39999999851],[105228.54600000009,432070.18699999899],[106035.17500000075,432057.01399999857],[106842.29199999943,432473.78700000048],[107494.3900000006,432594.35500000045],[107698.84800000116,432576.01799999923],[107010.31199999899,431151.42199999839],[106753.05200000107,431109.18899999931],[106369.5700000003,430279.47199999914],[106491.32699999958,429114.13699999824],[106403.125,429109.34099999815],[106294.49300000072,428665.20899999887],[105751.28000000119,428026.41000000015],[105587.43100000173,428417.32200000063],[104828.93100000173,429391.44999999925],[104268.93600000069,430433.54199999943],[103901.17399999872,430918.6799999997],[103213.30700000003,431507.91699999943]]]}&geometryType=esriGeometryPolygon&inSR=28992&f=geojson](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&geometry={"rings": [[[103213.30700000003,431507.91699999943],[103126.35799999908,431607.27199999988],[102615.19000000134,432732.09800000116],[102779.94999999925,432792.05999999866],[103345.83399999887,432239.02820000052],[103681.84600000083,432661.39999999851],[105228.54600000009,432070.18699999899],[106035.17500000075,432057.01399999857],[106842.29199999943,432473.78700000048],[107494.3900000006,432594.35500000045],[107698.84800000116,432576.01799999923],[107010.31199999899,431151.42199999839],[106753.05200000107,431109.18899999931],[106369.5700000003,430279.47199999914],[106491.32699999958,429114.13699999824],[106403.125,429109.34099999815],[106294.49300000072,428665.20899999887],[105751.28000000119,428026.41000000015],[105587.43100000173,428417.32200000063],[104828.93100000173,429391.44999999925],[104268.93600000069,430433.54199999943],[103901.17399999872,430918.6799999997],[103213.30700000003,431507.91699999943]]]}&geometryType=esriGeometryPolygon&inSR=28992&f=geojson)

## Daken binnen één kilometer van het Binnenhof

Request parameters:    
```
    where                       1=1
    geometryType                esriGeometryPoint
    geometry                    4.313273, 52.0795998
    inSR                        4326
    distance                    1000
    units                       esriSRUnit_Meter
    f                           geojson
```

Request:
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&geometryType=esriGeometryPoint&geometry=4.313273, 52.0795998&inSR=4326&distance=1000&units=esriSRUnit_Meter&f=geojson
