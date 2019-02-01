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
    spatialRel                  esriSpatialRelIntersects
    f                           geojson
```

Request:

https://geoservices.zuid-holland.nl/arcgis/rest/services/Ruimte/Zonnewijzer/FeatureServer/0/query?where=1=1&geometry={"rings": [[[103213.30700000003,431507.91699999943],[103126.35799999908,431607.27199999988],[102615.19000000134,432732.09800000116],[102779.94999999925,432792.05999999866],[103345.83399999887,432239.02820000052],[103681.84600000083,432661.39999999851],[105228.54600000009,432070.18699999899],[106035.17500000075,432057.01399999857],[106842.29199999943,432473.78700000048],[107494.3900000006,432594.35500000045],[107698.84800000116,432576.01799999923],[107010.31199999899,431151.42199999839],[106753.05200000107,431109.18899999931],[106369.5700000003,430279.47199999914],[106491.32699999958,429114.13699999824],[106403.125,429109.34099999815],[106294.49300000072,428665.20899999887],[105751.28000000119,428026.41000000015],[105587.43100000173,428417.32200000063],[104828.93100000173,429391.44999999925],[104268.93600000069,430433.54199999943],[103901.17399999872,430918.6799999997],[103213.30700000003,431507.91699999943]]]}&geometryType=esriGeometryPolygon&inSR=28992&f=geojson

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
