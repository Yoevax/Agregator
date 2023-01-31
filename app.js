let express = require('express');
let fs = require("fs");

let app = express();

app.use('/', express.static(__dirname + "/assets")) //tout repertoire devient accessible a partir du repertoire racine ici assets

app.set('view engine', 'ejs'); // por dire que le moteur de view c'est ejs

let fileContent; //pas besoin de changer de variable puisqu'on la manipule juste apres a chaque fois

//recup objet json pour la meteo
fileContent = fs.readFileSync("./data/meteo.json"); //lire en synchrone car fichier simple (pas volumineux)
let meteoAPI = JSON.parse(fileContent); //on le parse en json meme si c deja un "fichier json" car c'est des octets à ce niveau la (buffer)
let temperatures = meteoAPI.hourly.temperature_2m;

//recup objet json pour la qualité de l'air
fileContent = fs.readFileSync("./data/airQuality.json");
let airQualityAPI = JSON.parse(fileContent);
let airQualityVar = airQualityAPI.hourly.pm10;
let uniteMesureVar = airQualityAPI.hourly_units.pm10;

//recup objet json pour le taux de change
fileContent = fs.readFileSync("./data/floatRates.json");
let floatRatesAPI= JSON.parse(fileContent);
let RateVar = floatRatesAPI;

//recup objet json pour les concerts
fileContent = fs.readFileSync("./data/concerts.json");
let concertJSON= JSON.parse(fileContent);

//recup objet json pour les news
fileContent = fs.readFileSync("./data/musiqueLeMonde.json");
let newsMusicJSON= JSON.parse(fileContent);
let newsMusics = newsMusicJSON.rss.channel[0].item;
// console.log(JSON.stringify(newsMusicJSON.rss.channel[0].item[0]));

//recup image Nasa
fileContent = fs.readFileSync("./data/nasa.json");
let nasaJSON = JSON.parse(fileContent);
let nasa = nasaJSON;
// console.log(JSON.stringify(newsMusicJSON.rss.channel[0].item[0]));

//recup trains
fileContent = fs.readFileSync("./data/iRail.json");
let iRailArray = JSON.parse(fileContent);
let iRailArrayJ = iRailArray.departures.departure;

app.listen(8000, function () {
    console.log('Ecoute sur le port 8000');
})

let now = new Date();
let nowHour = now.getHours();
let nowTemperature = temperatures[nowHour];
let nowAirQuality = airQualityVar[nowHour];

app.get('/', function(request, response) { //quand le path est vide => lien qui envoie vers weather et rates
    response.setHeader('Content-Type', 'text/html; charset=utf-8');
    let dataToEJS = {
        temperature : nowTemperature,
        airQualityTemplate : nowAirQuality,
        uniteMesureTemplate :uniteMesureVar,
        rateTemplateUSD : RateVar.usd.rate.toFixed(2),
        rateTemplateCAD :RateVar.cad.rate.toFixed(2),
        rateTemplateSAR:RateVar.sar.rate.toFixed(2),
        rateTemplateJPY:RateVar.jpy.rate.toFixed(2),
        rateTemplateGBP:RateVar.gbp.rate.toFixed(2),
        rateTimeTemplateUSD: RateVar.usd.date,
        rateTimeTemplateCAD: RateVar.cad.date,
        rateTimeTemplateJPY: RateVar.jpy.date,
        rateTimeTemplateSAR: RateVar.sar.date,
        rateTimeTemplateGBP: RateVar.gbp.date,
        concerts : concertJSON,
        items: newsMusics, 
        urlNasa : nasa.hdurl, 
        nasaDescription : nasa.explanation,
        nasaTitre : nasa.title,
        iRail: iRailArrayJ
    }
    response.render('index.ejs', dataToEJS); //fusion entre fichier template et les datas
});

//pour demarrer le serveur sur apiupadate json faut juste mettre : node .\APIUpdateJSON.js