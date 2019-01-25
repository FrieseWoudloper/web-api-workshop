In deze oefeningen vragen we gegevens op via de Zonnewijzer service:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer   

Als je bovenstaande link volgt, krijg je een beschrijving. Dan kun je zien dat de Zonnewijzer service toegang biedt tot meer dan twintig kaartlagen. 

We zijn geïnteresseerd in de energieproductie door kleinverbruikers per gemeente. Dit is de vierde laag in de Zonnewijzer service. De laag heeft identificatienummer (ID) 3.     

Meer informatie over de kaartlaag - bijvoorbeeld over de attributen - krijg je via deze link:     
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3.    
 
We willen een bevraging doen en geen wijzigingen doorvoeren in de configuratie of inhoud van de kaartlaag. We kiezen daarom voor de actie `query`. Een actie wordt in het jargon een _operation_ genoemd.    

De URL voor onze requests wordt uiteindelijk:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query      
Merk op de dat de URL van de Zonnewijzer service is uitgebreid met het ID van de laag en de actie die we op deze laag willen uitvoeren!    

Voor een geldig request, moeten we aan de URL ook nog request parameters toevoegen. Hierna volgt een aantal voorbeelden van requests. Je kunt de requests ook in Postman uitvoeren.     
[![Run in Postman](https://run.pstmn.io/button.svg)](https://app.getpostman.com/run-collection/72b27942624d611382e9#?env%5Bworkshop-web-api%5D=W3sia2V5Ijoiem9ubmV3aWp6ZXJfc2VydmljZSIsInZhbHVlIjoiaHR0cHM6Ly9nZW9zZXJ2aWNlcy56dWlkLWhvbGxhbmQubmwvYXJjZ2lzL3Jlc3Qvc2VydmljZXMvUnVpbXRlL1pvbm5ld2lqemVyL0ZlYXR1cmVTZXJ2ZXIiLCJkZXNjcmlwdGlvbiI6IiIsInR5cGUiOiJ0ZXh0IiwiZW5hYmxlZCI6dHJ1ZX1d)  

## Complete dataset in GeoJSON formaat

Met de `where` parameter kun je rijen filteren op attribuutwaarden. De parameter is verplicht. Als je alle gegevens wilt, geef je de waarde `1=1` op. 

De `f` parameter gebruik je voor het specificeren van het formaat waarin de service de gegevens retourneert. Geldige waarden zijn bijvoorbeeld `html`, `json` en `geojson`.   

Request parameters:
```
    where 	1=1	
    f		geojson	
```
	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&f=geojson

## Energieproductie door kleinverbruikers per gemeente in JSON (zónder geometrie)    

Standaard worden alle attributen in de dataset geretourneerd. Ben je alleen geïnteresseerd in specifieke attributen, dan kun je dat aangeven in de `outFields` parameter. Welke attributen beschikbaar zijn, zie je in de [beschrijving van de laag](    
).    

Met de parameter `returnGeometry` bepaal je of de dataset die de service retourneert wel (`true`) of geen (`false`) geometrie bevat.         

Met `f=pjson` geeft de service het resultaat terug in 'pretty' JSON. Dat maakt het bestand beter leesbaar.    

Request parameters:
```
    where           1=1    
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false	
    f               pjson
```
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=pjson

## Gemeentes met een negatieve energieproductie door kleinverbruikers

Request parameters:
```
    where           opbrengst_kv_mwh<0    
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false
    f               pjson
```
Request:    
[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=pjson)


## Top 3 van gemeentes met de hoogste energieproductie door kleinverbruikers 

Met de `orderByFields` parameter kun je aangeven op welke attributen je wilt sorteren, oplopend (`ASC`) of aflopend (`DESC`).    

Het aantal rijen dat de service retourneert, kun je beperken door een waarde op te geven voor `resultRecordCount`.    

Door eerst aflopend te sorteren op energieproductie en vervolgens alleen de eerste drie rijen op te vragen, krijg je de top 3.    

Request parameters:
```
    where              1=1
    outFields	       gm_naam,opbrengst_kv_mwh
    returnGeometry     false
    orderByFields      opbrengst_kv_mwh DESC
    resultRecordCount  3
    f	               pjson
```	
Request:    
[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&orderByFields=opbrengst_kv_mwh DESC&resultRecordCount=3&f=json](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&orderByFields=opbrengst_kv_mwh+DESC&resultRecordCount=3&f=pjson)


## Totale energieproductie door kleinverbruikers in Zuid-Holland

Met de parameter `outStatistics` kun je statistieken opvragen. Per statistiek geef je aan 
* welk type statistiek je wilt (bijvoorbeeld `max`, `count` of `sum`), 
* voor welk attribuut je de statistiek wil laten berekenen en 
* wat de naam is van het attribuut waarin je het resultaat van de berekening wilt opslaan.

Request parameters:    
```
    where           1=1
    outStatistics   [{"statisticType":"sum",       
                      "onStatisticField":"opbrengst_kv_mwh",      
                      "outStatisticFieldName":"tot_opbrengst_kv_mwh"}]
    f               pjson
```	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outStatistics=[{"statisticType":"sum","onStatisticField":"opbrengst_kv_mwh","outStatisticFieldName":"tot_opbrengst_kv_mwh"}]&f=pjson

## Geometrie in RD New 

Als je kiest voor het GeoJSON formaat, wordt geometrie automatisch in het WGS84 (EPSG:4326) coordinatenstelsel geretourneerd. Je kunt een ander coördinatenstelsel opgeven met de `outSR` parameter, bijvoorbeeld RD New (EPSG:28992).    

Request parameters:    
```
    where           1=1                     
    outSR           28992
    f               geojson
```	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outSR=28992&f=geojson

## Gemeente waarin het punt met breedtegraad 52.0795985 en lengtegraad 4.313273 valt

Spoiler: dit zijn de GPS-coördinaten van het Binnenhof.

Dit is in de praktijk niet zo'n zinvolle bevraging, maar illustreert wel mooi dat je met een request ook een eenvoudige ruimtelijke analyse kunt doen.    

Voor zo'n analyse moet je eerst een _input geometry_ specificeren. Dat doe je met behulp van de parameters `geometryType`, `geometry` en `inSR`. Ze bevatten respectievelijk het type geometrie, de coördinaten en het coördinatenstelsel.  

Daarnaast moet je in de parameter `spatialRel` aangeven wat voor soort analyse je wilt doen. Welke ruimtelijke relatie met de input `geometry` wil je meenemen in de bevraging? Voorbeelden van ruimtelijke relaties zijn `intersects`, `contains`, `within`, enzovoorts.  

Request parameters:    
```
    where           1=1 
    geometryType    esriGeometryPoint 
    geometry        4.313273,52.0795985
    inSR            4326
    spatialRel      esriSpatialRelWithin
    f               geojson	
```

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&geometryType=esriGeometryPoint&geometry=4.313273,52.0795985&inSR=4326&spatialRel=esriSpatialRelWithin&f=geojson

## Meer informatie

Raadpleeg de ArcGIS REST API documentatie voor [meer informatie over query parameters](https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm#GUID-62EE7495-8688-4BD0-B433-89F7E4476673).





