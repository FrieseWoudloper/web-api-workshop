In deze oefeningen vragen we gegevens op via de Zonnewijzer service:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer   

Als je bovenstaande link volgt, krijg je een beschrijving. Dan kun je zien dat de Zonnewijzer service meer dan twintig kaartlagen ontsluit. 

We zijn geïnteresseerd in de energieproductie door kleinverbruikers per gemeente. Dit is de vierde laag in de Zonnewijzer service. De laag heeft identificatienummer (ID) 3.    

De URL voor bevragingen op deze kaartlaag wordt dan:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3      
Merk op de dat de URL van de Zonnewijzer service is uitgebreid met het ID van de laag die we willen bevragen!    

Voor een geldig request, moeten we aan de URL ook nog query-parameters toevoegen. Hierna volgen een aantal voorbeelden van requests.    

## De complete dataset in GeoJSON-formaat

Met de `where` parameter kun je rijen filteren op attribuutwaarden. De parameter is verplicht. Als je alle gegevens wilt, geef je de waarde `1=1` op. 

De `f` parameter gebruik je voor het specificeren van het formaat waarin de service de gegevens retourneert. Geldige waarden zijn bijvoorbeeld `html`, `json` en `geojson`.   

Query-parameters:
```
    where 	1=1	
    f		geojson	
```
	
Request:<br>
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&f=geojson

## De jaarlijkse energieproductie door kleinverbruikers per gemeente in JSON-formaat (zónder geometrie!)    

Standaard worden alle attributen in de dataset geretourneerd. Ben je alleen geïnteresseerd in specifieke attributen, dan kun je dat aangeven in de `outFields` parameter. Welke attributen beschikbaar zijn, zie je in de [beschrijving van de laag](    
).    

Met de parameter `returnGeometry` geef je aan of de dataset die de service retourneert wel (`true`) of geen (`false`) geometrie moet bevatten.    

Query-parameters:
```
    where	        1=1
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false	
    f               json
```
Request:
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json

## Alle gemeentes met een jaarlijkse productie door kleinverbruikers minder dan nul. 
Query-parameters:
```
    where	        opbrengst_kv_mwh<0
    outFields	    gm_naam,opbrengst_kv_mwh	
    returnGeometry  false
    f               json
```
Request:
[https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json)


Request 4: Vul het vorige request aan, zodat ook de gemeentegrenzen in het WGS84 (EPSG 4326) coordinatenstelsel worden opgevraagd.

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&outSR=4326&f=geojson

Request 5: De top 3 van gemeentes met de hoogste jaarlijkse productie door kleinverbruikers. 

where	1=1
outFields	gm_naam,opbrengst_kv_mwh
returnGeometry	false
orderByFields	opbrengst_kv_mwh DESC
resultRecordCount	3
f	json

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1%3D1&outFields=gm_naam%2Copbrengst_kv_mwh&returnGeometry=false&orderByFields=opbrengst_kv_mwh+DESC&resultRecordCount=3&f=json

Request 6: De totale jaarlijkse energieproductie door kleinverbruikers voor alle gemeenten in de dataset.

where 1=1
outStatistics	[{"statisticType":"sum", "onStatisticField":"opbrengst_kv_mwh", "outStatisticFieldName":"tot_opbrengst_kv_mw"}]
f	json

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1%3D1&outStatistics=%5B%7B%22statisticType%22%3A%22sum%22%2C%0D%0A+%22onStatisticField%22%3A%22opbrengst_kv_mwh%22%2C%0D%0A+%22outStatisticFieldName%22%3A%22tot_opbrengst_kv_mw%22%7D%5D&f=json

Request 7: binnen bounding box
 
Documentatie: https://developers.arcgis.com/rest/services-reference/query-feature-service-layer-.htm#GUID-62EE7495-8688-4BD0-B433-89F7E4476673






