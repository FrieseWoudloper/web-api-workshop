In deze oefening zijn we geïnteresseerd in de energieproductie door kleinverbruikers per gemeente. 

Dit is de vierde laag in de Zonnewijzer service. De laag heeft identificatienummer (ID) 3. Dit kun je checken in de [beschrijving van de service](https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer).    

De URL voor bevragingen op deze kaartlaag is:    
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3    

Merk op de dat de URL van de Zonnewijzer service is uitgebreid met het ID van de laag die we willen bevragen!    

Voor een geldig request, moeten we aan de URL ook nog query-parameters toevoegen.    

## Request 1: De complete dataset in GeoJSON-formaat

Query-parameters:
    where 	1=1	
    f		geojson	

Met de `where`-parameter kun je rijen filteren op attribuutwaarden. De parameter is verplicht. Als je alle gegevens wilt, geef je de waarde `1=1` op. Na HTML-encoding ziet dit er uit als `1%3D1`.
	
Request:	

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&f=geojson


## Request 2: D jaarlijkse productie door kleinverbruikers per gemeente in JSON-formaat (zónder geometrie)

Query-parameters:
    where	1=1
    outFields	gm_naam,opbrengst_kv_mwh	
    returnGeometry false	
    f       json

Request:
https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=1=1&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json

Request 3: Alle gemeentes met een jaarlijkse productie door kleinverbruikers minder dan nul. 
where	1=1
outFields	gm_naam,opbrengst_kv_mwh	
returnGeometry false
f       json

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/3/query?where=opbrengst_kv_mwh<0&outFields=gm_naam,opbrengst_kv_mwh&returnGeometry=false&f=json


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






