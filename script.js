const fs = require("fs");
const http = require("http");
const requests = require('requests');
const fileData = fs.readFileSync("index.html", "utf-8");

const replaceData = (orgData, apiData) => {
    let modifiedData = orgData.replace("{%temp&}", apiData.main.temp);
    modifiedData = modifiedData.replace('{%temp_min%}', apiData.main.temp_min);
    modifiedData = modifiedData.replace('{%temp_max%}', apiData.main.temp_max);
    modifiedData = modifiedData.replace('{%city%}', apiData.name);
    modifiedData = modifiedData.replace('{%country%}', apiData.sys.country);
    return modifiedData;
}

const server = http.createServer((req, res) => {
    if (req.url == "/") {
        requests('https://api.openweathermap.org/data/2.5/weather?q=Gujrat&appid=2ab1acd47a4d896d05f14be40843783b')
        .on('data', function (chunk) {
            const objData = JSON.parse(chunk);
            const arrayData = [objData];
            const realData = arrayData.map(val => replaceData(fileData, val)).join("");
            res.write(realData);
        })
        .on('end', function (err) {
            if (err) return console.log('connection closed due to errors', err);
            res.end();       
        });
    }
    else {
        res.end("File Not Found");
    }
});

server.listen(8000, "127.0.0.1");

// https://api.openweathermap.org/data/2.5/weather?q=Gujrat&appid=2ab1acd47a4d896d05f14be40843783b