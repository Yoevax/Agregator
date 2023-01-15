
//package
let http = require('http'); 
let https = require('https'); 
let fileStream = require('fs'); 
let parseString = require('xml2js').parseString; //on a besoin que de la methode du package
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

//Pour mettre à jour les données toutes les X secondes

//update pour les trains
function iRailUpdate(){
    //qd on appelle la fx, il construit la requete 
    let request = {
        "host": "api.irail.be",
        "port": 80,
        "path": "/liveboard/?id=BE.NMBS.008892007&lang=fr&format=json"
    }; 

    http.get(request,receiveResponseCallbackiRail);
    
    function receiveResponseCallbackiRail(response) {
        let rawData = "";
        response.on('data', (chunk) =>{
            rawData += chunk; //chaque chunk est un morceau du contenu de la page (objets)
        }); 

        response.on('end', function(chunk){
            let iRailAPI = JSON.parse(rawData); 
            let stringToSave = JSON.stringify(iRailAPI, null, 4);
            
            fileStream.writeFile('./data/iRail.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved iRail");
                    };
                }
            );
        });
    } 
}
//update pour la qualité de l'air
function airQualityUpdate(){
    let request = {
    "host": "air-quality-api.open-meteo.com",
    "port": 443,
    "path": "/v1/air-quality?latitude=52.5235&longitude=13.4115&hourly=pm10,pm2_5"
    }; 

    https.get(request,receiveResponseCallbackAirQuality);
    function receiveResponseCallbackAirQuality(response) {
        let rawData = "";
    
        response.on('data', (chunk) =>{rawData += chunk; }); //chaque chunk est un morceau du contenu de la page (objets)
        response.on('end', function(chunk){
            let airQuality = JSON.parse(rawData); 
            let stringToSave = JSON.stringify(airQuality, null, 4);
    
            fileStream.writeFile('./data/airQuality.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved AirQuality");
                    };
                }
            );
        });
    } 
}
//update pour les news
function newsUpdate(){
    let request = {
        "host": "www.lemonde.fr",
        "port": 443,
        "path": "/international/rss_full.xml"
    }; 
    https.get(request,receiveResponseCallbackNews);

    function receiveResponseCallbackNews(response) {
        let rawData = "";

        response.on('data', (chunk) =>{
            rawData += chunk; //chaque chunk est un morceau du contenu de la page (xml) qu'on stocke a chaque fois dans la var rawData
        }); 

        response.on('end', function(chunk){ // ce qu'il fait quand il a fini de mettre tous les paquets
            parseString(rawData, function (err, rssJson){ //transfo le rawData en string et on affiche le resultat 
                // console.log(`Le Monde annonce a publié ce ${rssJson.rss.channel[0].item[0].pubDate[0]}  : ${rssJson.rss.channel[0].item[0].title[0]}. ${rssJson.rss.channel[0].item[0].description[0]}`);
                let stringToSave = JSON.stringify(rssJson, null, 4);
                fileStream.writeFile('./data/musiqueLeMonde.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved News");
                    };
                });
            });
        });
    } 
}
//update pour le taux de change
function floatRatesUpdate(){
    let request = {
        "host": "www.floatrates.com",
        "port": 80,
        "path": "/daily/eur.json"
    }; 
    http.get(request,receiveResponseCallbackFloatRates);

    function receiveResponseCallbackFloatRates(response) {  
        let rawData = "";
    
        response.on('data', (chunk) =>{rawData += chunk; }); //chaque chunk est un morceau du contenu de la page (objets)
        response.on('end', function(chunk){
            let floatRates = JSON.parse(rawData); 
            let stringToSave = JSON.stringify(floatRates, null, 4);
            fileStream.writeFile('./data/floatRates.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved rates");
                    };
                }
            );
        });
    }   
}
//update pour la météo
function weatherForecast(){
    let request = {
        "host": "api.open-meteo.com",
        "port": 443,
        "path": "/v1/forecast?latitude=50.85&longitude=4.35&hourly=temperature_2m"
    }; 
    https.get(request,receiveResponseCallbackweatherForecast);
    function receiveResponseCallbackweatherForecast(response) {
        let rawData = "";
        response.on('data', (chunk) =>{rawData += chunk; }); 
        response.on('end', function(chunk){    
            let meteoAPI = JSON.parse(rawData); 
            // console.log(meteoAPI.hourly.temperature_2m[10]);
            let stringToSave = JSON.stringify(meteoAPI, null, 4);
            fileStream.writeFile('./data/meteo.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved weather Forecast");
                    };
                }
            );
        });
       
    } 
}

function nasaUpdate(){
    let request = {
        "host": "api.nasa.gov",
        "port": 443,
        "path": "/planetary/apod?api_key=hXPMW8RdK50HgDFjfCeXrHsNTejgIbGWAfsAq53e"
    }; 
    
    https.get(request,receiveResponseCallback);
    function receiveResponseCallback(response) {
        let rawData = "";
    
        response.on('data', (chunk) =>{rawData += chunk; }); //chaque chunk est un morceau du contenu de la page (objets)
        response.on('end', function(chunk){
            //console.log(rawData); 
            
            let airQuality = JSON.parse(rawData); 
    
            let stringToSave = JSON.stringify(airQuality, null, 4);
    
            fileStream.writeFile('./data/nasa.json', stringToSave,           
                function (err) {
                    if (err){
                        console.log(err);
                    }else {
                        console.log("File saved");
                    };
                }
            );
        });
    } 
}

//appels de fonction + mis a jour avec interval

nasaUpdate();
setInterval(nasaUpdate, 60000*60*24);

weatherForecast()
setInterval(weatherForecast, 60000*60*24);

floatRatesUpdate()
setInterval(floatRatesUpdate, 60000*60*24);

newsUpdate();
setInterval(newsUpdate, 360000);

iRailUpdate();//on appelle la fx directement pr que ca file saved directement et pas apres 1min
setInterval(iRailUpdate, 60000); //appelle la fx toutes les minutes

airQualityUpdate();
setInterval(airQualityUpdate, 60000*60*24); //pr update tous les jours
