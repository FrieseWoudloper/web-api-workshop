In deze oefeningen vragen we gegevens op via de Zonnewijzer service:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer   

Als je bovenstaande link volgt, krijg je een beschrijving. Dan kun je zien dat de Zonnewijzer service toegang biedt tot meer dan twintig kaartlagen. 

We zijn geïnteresseerd in de energieproductie door kleinverbruikers per gemeente. Dit is de vierde laag in de Zonnewijzer service. De laag heeft identificatienummer (ID) 3.    

De URL voor bevragingen op deze kaartlaag wordt dan:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3      
Merk op de dat de URL van de Zonnewijzer service is uitgebreid met het ID van de laag die we willen bevragen!    

Voor een geldig request, moeten we aan de URL ook nog query-parameters toevoegen. Hierna volgt een aantal voorbeelden van requests.    

## De complete dataset in GeoJSON-formaat

Met de `where` parameter kun je rijen filteren op attribuutwaarden. De parameter is verplicht. Als je alle gegevens wilt, geef je de waarde `1=1` op. 

De `f` parameter gebruik je voor het specificeren van het formaat waarin de service de gegevens retourneert. Geldige waarden zijn bijvoorbeeld `html`, `json` en `geojson`.   

Query-parameters:
```
    where 	1=1	
    f		geojson	
```
	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&f=geojson

## Jaarlijkse energieproductie door kleinverbruikers per gemeente in JSON (zónder geometrie)    

Standaard worden alle attributen in de dataset geretourneerd. Ben je alleen geïnteresseerd in specifieke attributen, dan kun je dat aangeven in de `outFields` parameter. Welke attributen beschikbaar zijn, zie je in de [beschrijving van de laag](    
).    

Met de parameter `returnGeometry` bepaal je of de dataset die de service retourneert wel (`true`) of geen (`false`) geometrie bevat.         

Met `f=pjson` geeft de service het resultaat terug in 'pretty' JSON. Dat maakt het bestand beter leesbaar.    

Query-parameters:
```
    where           1=1    
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false	
    f               pjson
```
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=pjson

## Gemeentes met een negatieve (!) energieproductie door kleinverbruikers
Query-parameters:
```
    where           opbrengst_kv_mwh<0    
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false
    f               pjson
```
Request:    
[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=pjson)


## Top 3 van gemeentes met de hoogste jaarlijkse energieproductie door kleinverbruikers 

Met de `orderByFields` parameter kun je aangeven op welke attributen je wilt sorteren, oplopend (`ASC`) of aflopend (`DESC`).    

Het aantal rijen dat de service retourneert, kun je beperken door een waarde op te geven voor `resultRecordCount`.    

Door eerst aflopend te sorteren op energieproductie en vervolgens alleen de eerste drie rijen op te vragen, krijg je de top 3.    

Query-parameters:
```
    where              1=1
    outFields	       gm_naam,opbrengst_kv_mwh
    returnGeometry     false
    orderByFields      opbrengst_kv_mwh DESC
    resultRecordCount  3
    f	               json
```	
Request:    
[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&orderByFields=opbrengst_kv_mwh DESC&resultRecordCount=3&f=json](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&orderByFields=opbrengst_kv_mwh+DESC&resultRecordCount=3&f=json)


## Totale energieproductie door kleinverbruikers

Met de parameter `outStatistics` kun je statistieken opvragen. Per statistiek geef je aan 
* welk type statistiek je wilt (bijvoorbeeld `max`, `count` of `sum`), 
* voor welk attribuut je de statistiek wil laten berekenen en 
* wat de naam is van het attribuut waarin je het resultaat van de berekening wilt opslaan.

Query-parameters:    
```
    where           1=1
    outStatistics   [{"statisticType":"sum",       
                      "onStatisticField":"opbrengst_kv_mwh",      
                      "outStatisticFieldName":"tot_opbrengst_kv_mw"}]
    f               pjson
```	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outStatistics=[{"statisticType":"sum","onStatisticField":"opbrengst_kv_mwh","outStatisticFieldName":"tot_opbrengst_kv_mw"}]&f=pjson

## Geometrie in RD New 

Als je kiest voor het GeoJSON formaat, wordt geometrie automatisch in het WGS84 (EPSG:4326) coordinatenstelsel geretourneerd. Je kunt een ander coördinatenstelsel opgeven met de `outSR` parameter, bijvoorbeeld RD New (EPSG:28992).    

Query-parameters:    
```
    where           1=1                     
    outSR           28992
    f               geojson
```	
Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outSR=28992&f=geojson

## Gemeente waarin het punt met breedtegraad 52.0795985 en lengtegraad 4.313273 valt

Spoiler: dit zijn de GPS-coördinaten van het Binnenhof.

Het is mogelijk om een ruimtelijke analyse uit te voeren met een API request. Dan moet je wel eerst een _input geometry_ specificeren. Dat doe je met behulp van de parameters `geometryType`, `geometry` en `inSR`. Zij bevatten respectievelijk het type geometrie, de coördinaten en het coördinatenstelsel.  

Daarnaast moet je in de parameter `spatialRel` aangeven wat voor soort analyse je wilt doen. Welke ruimtelijke relatie met de input `geometry` is onderdeel van de query? Voorbeelden van ruimtelijke relateis zijn `intersects`, `contains`, `within`, enzovoorts.  

Query-parameters:    
```
    geometryType      esriGeometryPoint 
    geometry          4.313273,52.0795985
    inSR              4326
    spatialRel        esriSpatialRelWithin
```

Request:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&geometryType=esriGeometryPoint&geometry=4.313273,52.0795985&inSR=4326&spatialRel=esriSpatialRelWithin&f=geojson

## Verdere informatie

Meer informatie over de query parameters voor het bevragen van een laag in een service: https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm#GUID-62EE7495-8688-4BD0-B433-89F7E4476673





