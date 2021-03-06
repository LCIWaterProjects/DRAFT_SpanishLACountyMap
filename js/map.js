// Global variables
let map;
let lat = 33.9;
let lon = -118.5;
let zl = 9;

let geojsonPath = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/RiskCode.geojson';
let geojson_data;
let geojson_layer;
let lacountypath = 'https://raw.githubusercontent.com/LCIWaterProjects/DRAFT-LA-County-Governance-Map/main/data/LA%20County%20Projected.geojson'

let brew = new classyBrew();
let legend = L.control({position: 'bottomleft'});
let info_panel = L.control();
let fieldtomap = 'GovernanceCode' ;
let fieldtype='choropleth'



// initialize+
$( document ).ready(function() {
    createMap(lat,lon,zl);
    getGeoJSON();
});

 
// create the map
function createMap(lat,lon,zl){
    map = L.map('map').setView([lat,lon], zl);

    L.tileLayer('https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}',
	{
		attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		maxZoom: 18,
		id: 'light-v10',
		tileSize: 512,
		zoomOffset: -1,
		accessToken: 'pk.eyJ1Ijoic2FyYWhwZXJlejEiLCJhIjoiY2t0MG9hZDNnMDZ2NDJ1c2M5dzBmb201OSJ9.5fv8NqX5cfA0NMcmEW_63g'
	})
    .addTo(map);
    const search = new GeoSearch.GeoSearchControl({
        provider: new GeoSearch.OpenStreetMapProvider(),});
        map.addControl(search);
      
      const searchControl = new SearchControl({
          provider: new OpenStreetMapProvider(),
          style: 'bar',
          position: 'topleft',
        });
      
        map.addControl(searchControl);
        
   
}


// function to get the geojson data
    $.getJSON(geojsonPath,function(data){
        

        // put the data in a global variable
        geojson_data = data;

        // call the map function
        mapGeoJSON(fieldtomap,5,'YlOrRd','quantiles');
    })

function mapGeoJSON(field,num_classes,color,scheme){

    // clear layers in case it has been mapped already
    if (geojson_layer){
        geojson_layer.clearLayers()
    }
    
    // globalize the field to map
    fieldtomap = field;
    
    // create an empty array
    let values = [];

    // based on the provided field, enter each value into the array
    geojson_data.features.forEach(function(item,index){
        if((item.properties[field] != undefined ) ){
            values.push(item.properties[field])
        }
    })

    // set up the "brew" options
    brew.setSeries(values);
    brew.setNumClasses(num_classes);
    brew.setColorCode(color);
    brew.classify(scheme);

    // create the layer and add to map
    geojson_layer = L.geoJson(geojson_data, {
        style: getStyle, //call a function to style each feature
        onEachFeature: onEachFeature // actions on each feature
    }).addTo(map);
    
    // turning off fit bounds so that we stay in mainland USA
    // map.fitBounds(geojson_layer.getBounds())


    // create the legend
    createLegend();

    // create the infopanel
    createInfoPanel();

    //create table
    createTable();

 
}//original getstyle commented out
//function getStyle(feature){return {stroke: true,color: 'white', weight: 1, fill: true,fillColor: brew.getColorInRange(feature.properties[fieldtomap]),fillOpacity: 0.8}}

//Coding for English Data
function getStyle(feature){
    if(fieldtomap == 'GovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#272727' :
                   d == 8  ? '#C47335 ' :
                   d == 7  ? '#1AC8ED' : 
                   d == 6  ? '#F46036 ' :
                   d == 5  ? '#109648 ' :
                   d == 4  ? '#51344D' :
                   d == 3  ? '#FED18C' :
                   d == 2  ? '#5BC8AF ' :
                   d == 1  ? '#6C91BF':
                                '#5B769A';
                              
        }
     }
     else if(fieldtomap == 'MechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#CECfC7' :
                   d == 2  ? '#F3A712' :
                   d == 1  ? '#E4572E':
                                '#8CB369';
                              
        }
    }
    else if(fieldtomap == 'Population'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#8D3C01' :
                    d > 270000  ? '#BD580F' :
                    d > 115000  ? '#E37826' :
                    d > 70000  ? '#FF990A' :
                    d > 35000  ? '#FFC247':
                                 '#FFD899';
                              
        }
    }
    else if(fieldtomap == 'Service_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#330462' :
                    d > 30000  ? '#584884' :
                    d > 10000 ? '#6A7AA0' :
                    d > 3300 ? '#62A7A6' :
                    d > 500  ? '#8DCEB4':
                                 '#BFEDCF';
                              
        }
    }
    else if(fieldtomap == 'WaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#6C0F12' :
                    d > 72 ? '#A4161A' :
                    d > 57 ? '#D71D24' :
                    d > 38  ? '#E74B51':
                    d > 0 ? '#EE8185':
                                 '#CECFC7';
                              
        }
    }
    else if(fieldtomap == 'HMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 7  ? '#003D2D' :
            d > 6  ? '#00523D' :
            d > 5  ? '#0B6B46' :
            d > 4  ? '#16834F' :
            d > 3  ? '#55A630' :
            d > 2  ? '#97D91C' :
            d > 1 ? '#DCF613' :
            d > 0  ? '#F0FB9D' :
                         '#CECFC7';
        }
    }
    else if(fieldtomap == 'RiskCode_RiskCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 0 ? '#cecfc7' :
            d == 1  ? '#20bf55' :
            d == 2 ? '#f9c846':
            d == 3 ? '#f96900':
            d == 4 ? '#e3170a':
                         '#412722';
        }
    }
    else if(fieldtomap == 'RiskCode_FiveMCL'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 0 ? '#b4dce4' :
            d == 1  ? '#1f78b4' :
            d == 2 ? '#f96900':
            d == 3 ? '#f96900':
            d == 4 ? '#f96900':
            d == 5 ? '#e3170a':
            d > 5 ? '#e3170a':
                         '#CECFC7';
        }
    }
    else if(fieldtomap == 'Operator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#FA0F36' :
            d == 0  ? '#ABB4C4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'No operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#FA0F36' :
            d == 0  ? '#ABB4C4' :
                         '#412722';
        }
    }
 
    
   //Coding for Spanish Data  
 if(fieldtomap == 'SpanGovernanceCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 9  ? '#cab2d6' :
                   d == 8  ? '#ff7f00' :
                   d == 7  ? '#fdbf6f' :
                   d == 6  ? '#e31a1c' :
                   d == 5  ? '#fb9a99' :
                   d == 4  ? '#33a02c' :
                   d == 3  ? '#b2df8a' :
                   d == 2  ? '#1f78b4' :
                   d == 1  ? '#a6cee3':
                                '#412722';
                              
        }
     }
    else if(fieldtomap == 'SpanMechanismCode'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return d == 3  ? '#fc8d62' :
                   d == 2  ? '#8da0cb' :
                   d == 1  ? '#66c2a5':
                                '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanPopulation'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 476000  ? '#33a02c' :
                    d > 270000  ? '#b2df8a' :
                    d > 115000  ? '#1f78b4' :
                    d > 70000  ? '#fb9a99' :
                    d > 35000  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanService_Co'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 100000 ? '#33a02c' :
                    d > 30000  ? '#b2df8a' :
                    d > 10000 ? '#1f78b4' :
                    d > 3300 ? '#fb9a99' :
                    d > 500  ? '#a6cee3':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanWaterBill'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d > 90  ? '#b2df8a' :
                    d > 72 ? '#1f78b4' :
                    d > 57 ? '#fb9a99' :
                    d > 38  ? '#a6cee3':
                    d > 0 ? '#cab2d6':
                                 '#412722';
                              
        }
    }
    else if(fieldtomap == 'SpanHMW'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 8  ? '#cab2d6' :
            d == 7  ? '#ff7f00' :
            d == 6  ? '#fdbf6f' :
            d == 5  ? '#e31a1c' :
            d == 4  ? '#fb9a99' :
            d == 3  ? '#33a02c' :
            d == 2  ? '#b2df8a' :
            d == 1  ? '#1f78b4' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'SpanOperator Below Required'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else if(fieldtomap == 'SpanNo operator'){
        return {
            stroke: true,
            color: 'white',
            weight: 1,
            fill: true,
            fillColor: getColor(feature.properties[fieldtomap]),
            fillOpacity: 0.8
        }

        function getColor(d) {

            return  d == 1 ? '#cab2d6' :
            d == 0  ? '#ff7f00' :
                         '#412722';
        }
    }
    else{
    return {
        stroke: true,
        color: 'white',

        weight: 1,
        fill: true,
        fillColor: brew.getColorInRange(feature.properties[fieldtomap]),
        fillOpacity: 0.8
        }
    }
}

function createLegend(){
    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend'),
        breaks = brew.getBreaks(),
        labels = [],
        from, to;
        console.log('mapping '+fieldtomap)

        //Coding for English Legends

        if(fieldtomap == 'GovernanceCode'){
            div.innerHTML =
            '<b>Tipo de Gobernanza del Sistema de Agua</b><br>'+
            '<div style="background-color: #6C91BF"></div>Ciudad/Municipal<br>' +
            '<div style="background-color: #5BC8AF"></div>Condado<br>' +
            '<div style="background-color: #51344D"></div>Utilidad Propiedad del Inversionista<br>' +
            '<div style="background-color: #FED18C"></div>Mutua de Agua<br>'+
            '<div style="background-color: #109648"></div>Distrito Especial<br>' +
            '<div style="background-color: #F46036"></div>Autocaravana<br>' +
            '<div style="background-color: #1AC8ED"></div>Distrito de Riego<br>'+
            '<div style="background-color: #C47335"></div>Otro Privado<br>'+
            '<div style="background-color: #272727"></div>Desconocido<br>'
            return div;
            
    
        }
        else if(fieldtomap == 'MechanismCode'){
            div.innerHTML =
            '<b>Cómo se Elige el Liderazgo</b><br>'+
            '<div style="background-color: #E4572E"></div>Elecciones<br>'+
            '<div style="background-color: #F3A712"></div>Nombramiento<br>'+
            '<div style="background-color: #CECFC7"></div>Sin Datos<br>'
            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Population'){
            div.innerHTML =
            '<b>Población del Sistema de Agua (Personas)</b><br>'+
            '<div style="background-color: #FFD899"></div>0 - 35,000<br>'+
            '<div style="background-color: #FFC247"></div>35,001 - 70,000<br>'+
            '<div style="background-color: #FF990A"></div>70,001 - 115,000<br>'+
            '<div style="background-color: #E37826"></div>115,001 - 270,000<br>'+
            '<div style="background-color: #BD580F"></div>270,001 - 476000<br>'+
            '<div style="background-color: #8D3C01"></div>Over 476,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Service_Co'){
            div.innerHTML =
            '<b>Conexiones de Servicio del Sistema<br>de Agua (Casas/Edificios)</b><br>'+
            '<div style="background-color: #BFEDCF"></div>0 - 500<br>'+
            '<div style="background-color: #8DCEB4"></div>501 - 3,300<br>'+
            '<div style="background-color: #62A7A6"></div>3,301 - 10,000<br>'+
            '<div style="background-color: #6A7AA0"></div>10,001 - 30,000<br>'+
            '<div style="background-color: #584884"></div>30,001 - 100,000<br>'+
            '<div style="background-color: #330462"></div>Over 100,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'WaterBill'){
            div.innerHTML =
            '<b>Factura Media de Agua</b><br>'+
            '<div style="background-color: #F5B7B9"></div>$0 - $38<br>'+
            '<div style="background-color: #EE8185"></div>$38 -$57<br>'+
            '<div style="background-color: #E74B51"></div>$57 - $72<br>'+
            '<div style="background-color: #D71D24"></div>$72 - $90<br>'+
            '<div style="background-color: #A4161A"></div>Mas que $90<br>'+
            '<div style="background-color: #CECFC7"></div>Sin Datos<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'HMW'){
            div.innerHTML =
            '<b>Horas de Salario Mínimo Tiene<br>Que Trabajar para Pagar la<br>Factura de Agua</b>'+
            '<br><div style="background-color: #CECFC7"></div>Sin Datos<br>'+
            '<div style="background-color: #F0FB9D"></div>1 Hora<br>' +
            '<div style="background-color: #DCF613"></div>2 Horas<br>' +
            '<div style="background-color: #97D91C"></div>3 Horas<br>'+
            '<div style="background-color: #55A630"></div>4 Horas<br>' +
            '<div style="background-color: #16834F"></div>5 Horas<br>' +
            '<div style="background-color: #0B6B46"></div>6 Horas<br>' +
            '<div style="background-color: #00523D"></div>7 Horas<br>'+
            '<div style="background-color: #003D2D"></div>8 Horas<br>'
          


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'RiskCode_RiskCode'){
            div.innerHTML =
            '<b>Calificación de Riesgo</b><br>'+
            '<div style="background-color: #CECFC7"></div>Not Incluido en la Evaluación de Riesgos<br>' +
            '<div style="background-color: #20BF55"></div>No en Riesgo<br>' +
            '<div style="background-color: #F9C846"></div>Potencialmente en Riesgo<br>' +
            '<div style="background-color: #F96900"></div>En Riesgo<br>' +
            '<div style="background-color: #E3170A"></div>Defecto<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'Operator Below Required'){
            div.innerHTML =
            '<b>¿El Operador de mi Sistema de Agua Cumple con los Requisitos de Certificacion?</b><br>'+
            '<div style="background-color: #FA0F36"></div>No<br>' +
            '<div style="background-color: #ABB4C4"></div>Si<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'No operator'){
            div.innerHTML =
            '<b>¿Su Sistema de Agua tiene un Operador?</b><br>'+
            '<div style="background-color: #FA0F36"></div>No<br>' +
            '<div style="background-color: #ABB4C4"></div>Si<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'RiskCode_FiveMCL'){
            div.innerHTML =
            '<b>Número de Infracciones al Sistema de Agua</b><br>'+
            '<div style="background-color: #CECFC7"></div>Sin Datos<br>' +
            '<div style="background-color: #B4DCE4"></div>Sin Infracciones<br>' +
            '<div style="background-color: #1f78b4"></div>1<br>' +
            '<div style="background-color: #F96900"></div>2-4<br>' +
            '<div style="background-color: #E3170A"></div>5 o Mas<br>' 
             
            


            return div;
            console.log('mapping mechanism code')



        }
//Coding for Spanish Legends 

        if(fieldtomap == 'SpanGovernanceCode'){
            div.innerHTML =
            '<b>Water System Governance Type</b><br>'+
            '<div style="background-color: #a6cee3"></div>City/Municpal<br>' +
            '<div style="background-color: #1f78b4"></div>County<br>' +
            '<div style="background-color: #b2df8a"></div>Mutual Water Company<br>'+
            '<div style="background-color: #33a02c"></div>Investor Owned Utility<br>' +
            '<div style="background-color: #fb9a99"></div>Special District<br>' +
            '<div style="background-color: #e31a1c"></div>Mobile Home<br>' +
            '<div style="background-color: #fdbf6f"></div>Irrigation District<br>'+
            '<div style="background-color: #ff7f00"></div>Other Private<br>'+
            '<div style="background-color: #cab2d6"></div>Unknown<br>'
            return div;
            
    
        }
        else if(fieldtomap == 'SpanMechanismCode'){
            div.innerHTML =
            '<b>How Is Leadership Chosen?/b>'+
            '<div style="background-color: #66c2a5"></div>Election<br>'+
            '<div style="background-color: #8da0cb"></div>Appointment<br>'+
            '<div style="background-color: #fc8d62"></div>No Data<br>'
            return div;
            



        }
        else if(fieldtomap == 'SpanPopulation'){
            div.innerHTML =
            '<b>Water System Population</b>'+
            '<div style="background-color: #412722"></div>0 - 35,000<br>'+
            '<div style="background-color: #8da0cb"></div>35,001 - 70,000<br>'+
            '<div style="background-color: #8da0cb"></div>70,001 - 115,000<br>'+
            '<div style="background-color: #8da0cb"></div>115,001 - 270,000<br>'+
            '<div style="background-color: #8da0cb"></div>270,001 - 476000 <br>'+
            '<div style="background-color: #8da0cb"></div>Over 476,000<br>'

            return div;
            



        }
        else if(fieldtomap == 'SpanService_Co'){
            div.innerHTML =
            '<b>Water System Service Connections</b>'+
            '<div style="background-color: #F0D6FF"></div>0 - 500<br>'+
            '<div style="background-color: #DCADFF"></div>501 - 3,300<br>'+
            '<div style="background-color: #A965E2"></div>3,301 - 10,000<br>'+
            '<div style="background-color: #8A37D2"></div>10,001 - 30,000<br>'+
            '<div style="background-color: #5C199F"></div>30,001 - 100,000 <br>'+
            '<div style="background-color: #34085E"></div>Over 100,000<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanWaterBill'){
            div.innerHTML =
            '<b>Average<br> Water Bill</b>'+
            '<div style="background-color: #8da0cb"></div>$0 - $38<br>'+
            '<div style="background-color: #8da0cb"></div>$38 -$57<br>'+
            '<div style="background-color: #8da0cb"></div>$57 - $72<br>'+
            '<div style="background-color: #8da0cb"></div>$72 - $90 <br>'+
            '<div style="background-color: #8da0cb"></div>Over $90<br>'+
            '<div style="background-color: #412722"></div>No Rate Data<br>'

            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanHMW'){
            div.innerHTML =
            '<b>Minimum Wage Hours</b>'+
            '<div style="background-color: #a6cee3"></div>1 Hour<br>' +
            '<div style="background-color: #1f78b4"></div>2 Hours<br>' +
            '<div style="background-color: #b2df8a"></div>3 Hours<br>'+
            '<div style="background-color: #33a02c"></div>4 Hours<br>' +
            '<div style="background-color: #fb9a99"></div>5 Hours<br>' +
            '<div style="background-color: #e31a1c"></div>6 Hours<br>' +
            '<div style="background-color: #fdbf6f"></div>7 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>8 Hours<br>'+
            '<div style="background-color: #ff7f00"></div>No Data<br>'


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanOperator Below Required'){
            div.innerHTML =
            '<b>Operator Below Required</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else if(fieldtomap == 'SpanNo operator'){
            div.innerHTML =
            '<b>Does my water system have an operator</b>'+
            '<div style="background-color: #a6cee3"></div>Yes<br>' +
            '<div style="background-color: #1f78b4"></div>No<br>' 
            


            return div;
            console.log('mapping mechanism code')



        }
        else {
            console.log('mapping other var')
            for (var i = 0; i < breaks.length; i++) {
                from = breaks[i];
                to = breaks[i + 1];
                if(to) {
                    labels.push(
                        '<i style="background:' + brew.getColorInRange(to) + '"></i> ' +
                        from.toFixed(0) + ' &ndash; ' + to.toFixed(0));
                    }
                }
                
                div.innerHTML =
              '<b>Data Legend <b>Data Legend in Spanish'
               
                return div;
            }; 
    
    
    
        }
    
        
        legend.addTo(map);
}

function createInfoPanel(){

    info_panel.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info');
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info_panel.update = function (properties) {
        // if feature is highlighted
        //English Info Panel Code here 
        if(properties){
            this._div.innerHTML =`<br><b> ${properties['Name']}</b>`
            if(fieldtomap == 'GovernanceCode'){
            this._div.innerHTML =`
            <p style="color:black;font-size:14px;line-height:1.5em;">
            <b>Información de Gobernanza</b>
            <br><b>${properties['Name']}</b>
            <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
            <br><b>Tipo de Gobernanza:</b> ${properties['GovernanceType']}
            <br><b>Cómo se Elige el Liderazgo:</b> ${properties['Mechanism']}
            <br><b>Próximo Año de Elecciones:</b> ${properties['UpcomingElectionYear']}
            <br><b>Conexiones de Servicio:</b> ${properties['Service_Co']}
            <br><b>Población del Sistema:</b> ${properties['Population']}
            <br><b>Población por Raza:</b>
            <br><div id="apexchart">
            </div></p>
            
            ` 
            }    
        else if(fieldtomap == 'MechanismCode'){
            this._div.innerHTML = `
            <p style="color:black;font-size:14px;line-height:1.5em;">
            <b>Información de Gobernanza</b>
            <br><b>${properties['Name']}</b>
            <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
            <br><b>Tipo de Gobernanza:</b> ${properties['GovernanceType']}
            <br><b>Cómo se Elige el Liderazgo:</b> ${properties['Mechanism']}
            <br><b>Próximo Año de Elecciones:</b> ${properties['UpcomingElectionYear']}
            <br><b>Conexiones de Servicio:</b> ${properties['Service_Co']}
            <br><b>Población del Sistema:</b> ${properties['Population']}
            <br><b>Población por Raza:</b>
            <br><div id="apexchart">
            </div></p>
            `}    
            else if(fieldtomap == 'Population'){
                this._div.innerHTML = `
                <p style="color:black;font-size:14px;line-height:1.5em;">
                <b>Información de Gobernanza</b>
                <br><b>${properties['Name']}</b>
                <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                <br><b>Tipo de Gobernanza:</b> ${properties['GovernanceType']}
                <br><b>Cómo se Elige el Liderazgo:</b> ${properties['Mechanism']}
                <br><b>Próximo Año de Elecciones:</b> ${properties['UpcomingElectionYear']}
                <br><b>Conexiones de Servicio:</b> ${properties['Service_Co']}
                <br><b>Población del Sistema:</b> ${properties['Population']}
                <br><b>Población por Raza:</b>
                <br><div id="apexchart">
                </div></p>
                
                ` }    

       else if(fieldtomap == 'Service_Co'){
                this._div.innerHTML = `
                <p style="color:black;font-size:14px;line-height:1.5em;">
                <b>Información de Gobernanza</b>
                <br><b>${properties['Name']}</b>
                <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                <br><b>Tipo de Gobernanza:</b> ${properties['GovernanceType']}
                <br><b>Cómo se Elige el Liderazgo:</b> ${properties['Mechanism']}
                <br><b>Próximo Año de Elecciones:</b> ${properties['UpcomingElectionYear']}
                <br><b>Conexiones de Servicio:</b> ${properties['Service_Co']}
                <br><b>Población del Sistema:</b> ${properties['Population']}
                <br><b>Población por Raza:</b>
                <br><div id="apexchart">
                </div></p>
                
                ` }    
        else if(fieldtomap == 'WaterBill'){
                this._div.innerHTML = 
                `<p style="color:black;font-size:14px;line-height:1.5em;"><b>Información de la Factura de Agua</b>
                <br><b>${properties['Name']}</b>
                <br><b>Factura Media de Agua:</b> $${properties['WaterBill']}
                <br>Mi factura de agua es <b>${properties['RiskCode_Percent']}% ${properties['OU']}</b> la factura media en
                <br> el condado de Los Ángeles.
                <br>Se necesita una <b>${properties['HMW']} horas de salario minimo</b>
                <br> para pagar su factura de agua.
                </p> 
                <p style="color:black;font-size:10px;">Projecto de media factura se calcula asumiendo un consumo doméstico promedio de 6 CCF, lo que refleja tanto los objetivos de conservación del agua como el objetivo del derecho humano al agua de California.</p> `}     
        else if(fieldtomap == 'HMW'){
                 this._div.innerHTML =
                 `<p style="color:black;font-size:14px;line-height:1.5em;"><b>Información de la Factura de Agua</b>
                 <br><b>${properties['Name']}</b>
                 <br><b>Factura Media de Agua:</b> $${properties['WaterBill']}
                 <br>Mi factura de agua es <b>${properties['RiskCode_Percent']}% ${properties['OU']}</b> la factura media en
                 <br> el condado de Los Ángeles.
                 <br>Se necesita una <b>${properties['HMW']} horas de salario minimo</b>
                 <br> para pagar su factura de agua.
                 </p> 
                 <p style="color:black;font-size:10px;">Projecto de media factura se calcula asumiendo un consumo doméstico promedio de 6 CCF, lo que refleja tanto los objetivos de conservación del agua como el objetivo del derecho humano al agua de California.</p>`}  
        else if(fieldtomap == 'RiskCode_RiskCode'){
                this._div.innerHTML =
                `<p style="color:black;font-size:14px;line-height:1.5em;"><b>Rendimiento del Sistema</b>
                <br><b>${properties['Name']}</b>
                <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                <br><b>Evaluación de Riesgos</b>
                <br>La Evaluación de Riesgos del Condado de Los Ángeles analizó los sistemas de agua con 3300 o menos conexiones de servicio para detectar su falla de riesgo.
                <br><b>Puntuación de Riesgo:</b> ${properties['RiskCode_SpanRiskScore']}
                <br><a href="https://innovation.luskin.ucla.edu/wp-content/uploads/2021/07/LA-County-Small-Water-System-Risk-Assessment.pdf" target="_blank">Lea la Evaluación de Riesgos del Condado de Los Ángeles aquí.</a>
                <br><b>Operadores de Sistemas de Agua</b>
                <br>Operadores de sistemas de agua están capacitados y certificados para las operaciones de tratamiento y manteniendo los sistemas.  
                <br><b>Nivel de Operador del Sistema Requerido:</b> ${properties['NewSpanMerge_ReqOp']}
                <br><b>Nivel de Operador del Sistema Actual:</b> ${properties['NewSpanMerge_HighestOp']}
                <br>Este sistema tiene<b> ${properties['NewSpanMerge_FiveMCL']} violaciones de salud </b> durante 2014-2018.
                    
                </p>`}  
        else if(fieldtomap == 'RiskCode_FiveMCL'){
                this._div.innerHTML =
                                    `<p style="color:black;font-size:14px;line-height:1.5em;"><b>Rendimiento del Sistema</b>
                                    <br><b>${properties['Name']}</b>
                                    <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                                    <br><b>Evaluación de Riesgos</b>
                                    <br>La Evaluación de Riesgos del Condado de Los Ángeles analizó los sistemas de agua con 3300 o menos conexiones de servicio para detectar su falla de riesgo.
                                    <br><b>Puntuación de Riesgo:</b> ${properties['RiskCode_SpanRiskScore']}
                                    <br><a href="https://innovation.luskin.ucla.edu/wp-content/uploads/2021/07/LA-County-Small-Water-System-Risk-Assessment.pdf" target="_blank">Lea la Evaluación de Riesgos del Condado de Los Ángeles aquí.</a>
                                    <br><b>Operadores de Sistemas de Agua</b>
                                    <br>Operadores de sistemas de agua están capacitados y certificados para las operaciones de tratamiento y manteniendo los sistemas.  
                                    <br><b>Nivel de Operador del Sistema Requerido:</b> ${properties['NewSpanMerge_ReqOp']}
                                    <br><b>Nivel de Operador del Sistema Actual:</b> ${properties['NewSpanMerge_HighestOp']}
                                    <br>Este sistema tiene<b> ${properties['NewSpanMerge_FiveMCL']} violaciones de salud </b> durante 2014-2018.
                                        
                                    </p>`}   
        else if(fieldtomap == 'Operator Below Required'){
                this._div.innerHTML =
                `<p style="color:black;font-size:14px;line-height:1.5em;"><b>Rendimiento del Sistema</b>
                <br><b>${properties['Name']}</b>
                <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                <br><b>Evaluación de Riesgos</b>
                <br>La Evaluación de Riesgos del Condado de Los Ángeles analizó los sistemas de agua con 3300 o menos conexiones de servicio para detectar su falla de riesgo.
                <br><b>Puntuación de Riesgo:</b> ${properties['RiskCode_SpanRiskScore']}
                <br><a href="https://innovation.luskin.ucla.edu/wp-content/uploads/2021/07/LA-County-Small-Water-System-Risk-Assessment.pdf" target="_blank">Lea la Evaluación de Riesgos del Condado de Los Ángeles aquí.</a>
                <br><b>Operadores de Sistemas de Agua</b>
                <br>Operadores de sistemas de agua están capacitados y certificados para las operaciones de tratamiento y manteniendo los sistemas.  
                <br><b>Nivel de Operador del Sistema Requerido:</b> ${properties['NewSpanMerge_ReqOp']}
                <br><b>Nivel de Operador del Sistema Actual:</b> ${properties['NewSpanMerge_HighestOp']}
                <br>Este sistema tiene<b> ${properties['NewSpanMerge_FiveMCL']} violaciones de salud </b> durante 2014-2018.
                    
                </p>`}   
        else if(fieldtomap == 'No operator'){
                this._div.innerHTML =`<p style="color:black;font-size:14px;line-height:1.5em;"><b>Rendimiento del Sistema</b>
                <br><b>${properties['Name']}</b>
                <br><a href="https://innovation.luskin.ucla.edu/" target="_blank">Datos Completos del Sistema de Agua</a>
                <br><b>Evaluación de Riesgos</b>
                <br>La Evaluación de Riesgos del Condado de Los Ángeles analizó los sistemas de agua con 3300 o menos conexiones de servicio para detectar su falla de riesgo.
                <br><b>Puntuación de Riesgo:</b> ${properties['RiskCode_SpanRiskScore']}
                <br><a href="https://innovation.luskin.ucla.edu/wp-content/uploads/2021/07/LA-County-Small-Water-System-Risk-Assessment.pdf" target="_blank">Lea la Evaluación de Riesgos del Condado de Los Ángeles aquí.</a>
                <br><b>Operadores de Sistemas de Agua</b>
                <br>Operadores de sistemas de agua están capacitados y certificados para las operaciones de tratamiento y manteniendo los sistemas.  
                <br><b>Nivel de Operador del Sistema Requerido:</b> ${properties['NewSpanMerge_ReqOp']}
                <br><b>Nivel de Operador del Sistema Actual:</b> ${properties['NewSpanMerge_HighestOp']}
                <br>Este sistema tiene<b> ${properties['NewSpanMerge_FiveMCL']} violaciones de salud </b> durante 2014-2018.
                    
                </p>`}  
//Spanish Info Box Code Here 
                                            if(fieldtomap == 'SpanGovernanceCode'){
                                                this._div.innerHTML =`<br><b>Governance Information</b>
                                                <div><b>${properties['Name']}</b>
                                                <br>Link to Water System Website if able
                                                <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                <br>Table with appointed members and compensation
                                                <br>Participation Info here? 
                                                <br><b>Service Connections</b> ${properties['Service_Co']}
                                                <br><b>System Population:</b> ${properties['Population']}
                                                <br> Insert Population Chart here?
                                                <br`}    
                                            else if(fieldtomap == 'SpanMechanismCode'){
                                                this._div.innerHTML = `<br><b>Governance Information</b>
                                                <div><b>${properties['Name']}</b>
                                                <br>Link to Water System Website if able
                                                <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                <br>Table with appointed members and compensation
                                                <br>Participation Info here? 
                                                <br><b>Service Connections</b> ${properties['Service_Co']}
                                                <br><b>System Population:</b> ${properties['Population']}
                                                <br> Insert Population Chart here?
                                                <br`}    
                                                else if(fieldtomap == 'SpanPopulation'){
                                                    this._div.innerHTML = `<br><b>Governance Information</b>
                                                    <div><b>${properties['Name']}</b>
                                                    <br>Link to Water System Website if able
                                                    <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                    <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                    <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                    <br>Table with appointed members and compensation
                                                    <br>Participation Info here? 
                                                    <br><b>Service Connections</b> ${properties['Service_Co']}
                                                    <br><b>System Population:</b> ${properties['Population']}
                                                    <br> Insert Population Chart here?
                                                    <br`}    
                                    
                                           else if(fieldtomap == 'SpanService_Co'){
                                                    this._div.innerHTML = `<br><b>Governance Information</b>
                                                                            <div><b>${properties['Name']}</b>
                                                                            <br>Link to Water System Website if able
                                                                            <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                                                            <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                                                            <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                                                            <br>Table with appointed members and compensation
                                                                            <br>Participation Info here? 
                                                                            <br><b>Service Connections</b> ${properties['Service_Co']}
                                                                            <br><b>System Population:</b> ${properties['Population']}
                                                                            <br> Insert Population Chart here?
                                                                            <br`}    
                                            else if(fieldtomap == 'SpanWaterBill'){
                                                    this._div.innerHTML = `<b>Water Bill Information</b>
                                                                        <br>Couple sentences about how we calculate average water bill and what that means. 
                                                                        <div><b>${properties['Name']}</b>
                                                                        <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                                                        <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                                                        <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                                                         <br`}     
                                            else if(fieldtomap == 'SpanHMW'){
                                                     this._div.innerHTML =`<b>Water Bill Information</b>
                                                                            <br>Couple sentences about how we calculate average water bill and what that means. 
                                                                            <div><b>${properties['Name']}</b>
                                                                            <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                                                            <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                                                            <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                                                            <br`}  
                                            else if(fieldtomap == 'SpanOperator Below Required'){
                                                    this._div.innerHTML =`<b>System Performance</b>
                                                                                <br>Describe system performance here
                                                                                <div><b>${properties['Name']}</b>
                                                                                <br>link to CCR report? 
                                                                                <br>Required System Operator Level 
                                                                                <br>Does my system have an operator?
                                                                                <br>Does my system have the required operator level? 
                                                                                <br>DO we want to add NA or LA NA Risk scores here?
                                                                                <br>Perhaps adding an MCL variable to the map (button and here)
                                                                                <br`}  
                                            else if(fieldtomap == 'SpanNo Operator'){
                                                    this._div.innerHTML =`<b>System Performance</b>
                                                                                <br>Describe system performance here
                                                                                <div><b>${properties['Name']}</b>
                                                                                <br>link to CCR report? 
                                                                                <br>Required System Operator Level 
                                                                                <br>Does my system have an operator?
                                                                                <br>Does my system have the required operator level? 
                                                                                <br>DO we want to add NA or LA NA Risk scores here?
                                                                                <br>Perhaps adding an MCL variable to the map (button and here)
                                                                                <br`}                                             
    }
        else if(properties){
            this._div.innerHTML = `
                                    <div><b>${properties['Name']}</b>
                                    <br><b>Service Connections</b> ${properties['Service_Co']}
                                    <br><b>System Population:</b> ${properties['Population']}
                                    <br> Insert Population Chart here?
                                    <p class = "info-value">Test</p>
                                    <div id=apexchart style= "width:400px;height:400px"></div>
                                    <br><b>Governance Information</b>
                                    <br><b>Governance Type:</b> ${properties['GovernanceType']}
                                    <br><b>How is Leadership Chosen?:</b> ${properties['Mechanism']}
                                    <br><b>Next Election Year:</b> ${properties['UpcomingElectionYear']}
                                    <br><b>Water Bill</b>
                                    <br><b>Average Water Bill:</b> $${properties['WaterBill']}
                                    <br>My water bill is <b>${properties['AbsFromAvg']}% ${properties['OU']}</b> than average bill in LA County
                                    <br>It takes working <b>${properties['HMW']} hours at minimum wage</b> to pay my water bill.
                                    
                                    `
                                    ;}

       
        // if feature is not highlighted
        else
        {
            this._div.innerHTML = 'Haga Clic en un Sistema de Agua'
        }
    };

    info_panel.addTo(map);

}

// Function that defines what will happen on user interactions with each feature
function onEachFeature(feature, layer) {
    layer.on({
        //mouseover: highlightFeature,
        //mouseout: resetHighlight,
        click: highlightFeature, 
    });
}

// on mouse over, highlight the feature
function highlightFeature(e) {
    //resetHighlight(e)
    geojson_layer.resetStyle()
  
    var layer = e.target;

    // style to use on mouse over
    layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
    });

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront();
    }
    info_panel.update(layer.feature.properties);
    createDashboard(layer.feature.properties);
    
   
}

// on mouse out, reset the style, otherwise, it will remain highlighted
function resetHighlight(e) {
    geojson_layer.resetStyle(e.target);
    info_panel.update() // resets infopanel
}

// on mouse click on a feature, zoom in to it
function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds());
    info_panel.update(layer.feature.properties);
};
//function createDashboard(properties){

	// clear dashboard
	//$('.dashboard').empty();

	//console.log(properties)

// var options = {
//     chart: {
//       type: 'line'
//     },
//     series: [{
//       name: 'sales',
//       data: [30,40,35,50,49,60,70,91,125]
//     }],
//     xaxis: {
//       categories: [1991,1992,1993,1994,1995,1996,1997, 1998,1999]
//     }
//   }
  
//   var chart = new ApexCharts(document.querySelector("#chart"), options);
//   chart.render()
// //}
function createDashboard(properties){

	// clear dashboard
	$('.dashboard').empty();

	console.log(properties)

    // var options = {
    //     series: [
    //                    properties['Hispanic'],
    //                    properties['White'],
    //                    properties['Black'],
    //                    properties['Asian'],
    //                    properties['AIAN'],
    //                    properties['NHOPI'],
    //                    properties['Other'],
                       
    //            ],
    //     chart: {
    //     height: 250,
    //     type: 'radialBar',
    //   },
    //   plotOptions: {
    //     radialBar: {
    //       offsetY: 0,
    //       offsetX: 50,
    //       startAngle: 0,
    //       endAngle: 270,
    //       hollow: {
    //         margin: 5,
    //         size: '30%',
    //         background: 'transparent',
    //         image: undefined,
    //       },
    //       dataLabels: {
    //         name: {
    //           show: false,
    //         },
    //         value: {
    //           show: false,
    //         }
    //       }
    //     }
    //   },
    //   colors: ['#1ab7ea', '#0084ff', '#39539E', '#0077B5', '#39539E','#0077B5','#0077B5'],
    //   labels: ['Hispanic', 'White', 'Black', 'Asian','American Indian','Native Hawaiin or<br>Pacific Islander','Other',],
    //   legend: {
    //     show: true,
        
    //     floating: true,
    //     fontSize: '10px',
    //     position: 'left',
    //     offsetX: 1,
    //     offsetY: 1,
    //     labels: {
    //       useSeriesColors: true,
    //     },
    //     markers: {
    //       size: 0
    //     },
    //     formatter: function(seriesName, opts) {
    //       return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
    //     },
    //     itemMargin: {
    //       vertical: 0,
    //       position: 'left', 
    //     }
    //   },
    //   responsive: [{
    //     breakpoint: 480,
    //     options: {
    //       legend: {
    //           show: true
    //       }
    //     }
    //   }]
    //   };

    //   var chart = new ApexCharts(document.querySelector("#apexradial"), options);
    //   chart.render();
    
    

    
   // chart title
   let title = 'Racial Demographics ' + properties['Name'];
   // data values
   let data = [
           properties['Hispanic'],
           properties['White'],
           properties['Black'],
           properties['Asian'],
           properties['AIAN'],
           properties['NHOPI'],
           properties['Other'],
           properties['TwoOrMore'],
   ]
   // data fields
   let fields = [
       'Hispanic',
       'White',
       'Black',
       'Asian',
       'American Indian and Alaskan Native',
       'Native Hawaiian and other Pacific Islander',
       'Other Race',
       'Two or more Race',
   ]
console.log(data)


   var options2= {
       chart: {
           type: 'pie',
           plotOptions: {
                radialBar: {
                  offsetY: 100,
                  offsetX: 50,
                  startAngle: 0,
                  endAngle: 270,
                  hollow: {
                    margin: 5,
                    size: '30%',
                    background: 'transparent',
                    image: undefined,
                  },
                  dataLabels: {
                    name: {
                      show: false,
                    },
                    value: {
                      show: false,
                    }
                  }
                }
              },
           height: 200,
           width: '100%',  
           animations: {
               enabled: true,
           }, 
       },
       title: {},
       colors: ['#003452', '#005687', '#4E8FB4', '#9CC8E0', '#DD7F03','#FCA636','#FDBB63','#FFE985'],
       series: data,
       stroke: {
        width: 0,
        color: '#808080'
        },
       labels: fields,
       legend: {
        show: false,
        floating: true,
        fontSize: '10px',
        position: 'left',
        offsetX: 50,
        offsetY: 1,
        labels: {
          useSeriesColors: true,
          position: 'center',
        },
        markers: {
          size: 0
        },
        formatter: function(seriesName, opts) {
          return seriesName + ":  " + opts.w.globals.series[opts.seriesIndex]
        },
        itemMargin: {
          vertical: 0,
          position: 'center', 
        }
      },
   };

   var chart = new ApexCharts(document.querySelector("#apexchart"), options2)
   chart.render()
}
  
function zoomTo(geoid){

	let zoom2poly = geojson_layer.getLayers().filter(item => item.feature.properties.GEO_ID === geoid)

	map.fitBounds(zoom2poly[0].getBounds())
}

function createTable(){

	// empty array for our data
	let datafortable = [];

	// loop through the data and add the properties object to the array
	geojson_data.features.forEach(function(item){
		datafortable.push(item.properties)
	})

	// array to define the fields: each object is a column
	let fields = [
		{ name: "Name", type: "text"},
		{ name: 'pwsid', type: 'number'},
		{ name: 'Population', type: 'number'},
		{ name: 'RiskCode_RiskCode', type: 'number'},
        { name: 'RiskCode_RiskCode', type: 'number'},
        { name: 'RiskCode_RiskCode', type: 'number'},
        { name: 'RiskCode_RiskCode', type: 'number'},

        
	]
 
	// create the table in our footer
	$(".footertable").jsGrid({
		width: "98%",
		height: "300px",
		
		editing: true,
		sorting: true,
		paging: true,
		autoload: true,
 
		pageSize: 200,
		pageButtonCount: 5,
 
		data: datafortable,
		fields: fields,
		rowClick: function(args) { 
            console.log(args)
            zoomTo(args.item.Name)
        },
        });
        }
function zoomTo(Name){

let zoom2poly = geojson_layer.getLayers().filter(item => item.feature.properties.Name === Name)

map.fitBounds(zoom2poly[0].getBounds())
}


// create buttons function
function myPopFunction(){
    mapGeoJSON('Population',5,'YlOrRd','quantiles');}
function myServeFunction(){
    mapGeoJSON('Service_Co',5,'Dark2','quantiles');}

function myGovTypeFunction(){
    mapGeoJSON('GovernanceCode',7,'Paired','jenks');}

function myGovTypeFunctionSpanish(){
        mapGeoJSON('SpanGovernanceCode',7,'Paired','jenks');}

function myMechTypeFunction(){
    mapGeoJSON('MechanismCode',3,'Accent','equal interval');}

function myMechTypeFunctionSpanish(){
      mapGeoJSON('SpanMechanismCode',3,'Accent','equal interval');}

function myBillFunction(){
    mapGeoJSON('WaterBill',5,'YlOrRd','quantiles');}

function MinWageFunction(){
        mapGeoJSON('HMW',5,'YlOrRd','natural breaks');}
    
function myOpBelowFunction(){
    mapGeoJSON('Operator Below Required',4,'Accent','natural breaks');}

function myNoOpFunction(){
    mapGeoJSON('No operator',5,'Accent','natural breaks');}

function RiskFunction(){
        mapGeoJSON('RiskCode_RiskCode',5,'Accent','natural breaks');}

function SpanRiskFunction(){
            mapGeoJSON('No operator',5,'Accent','natural breaks');}
function MCLFunction(){
                mapGeoJSON('RiskCode_FiveMCL',5,'Accent','natural breaks');}
function SpanMCLFunction(){
                    mapGeoJSON('NewSpanMerge_FiveMCL',5,'Accent','natural breaks');}

function on() {
        document.getElementById("overlay").style.display = "block";
                      }
                      
function off() {
            document.getElementById("overlay").style.display = "none";
                      }