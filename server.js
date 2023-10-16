const express = require('express');
const app = express();
const axios = require('axios');
const dotenv = require('dotenv').config();
const path = require('path');
const webhook = require('./webhooks');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req , res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

const os = require('os');
app.get('/status', (req , res) => {
    const cpuInfo = os.cpus();
    const totalMemory = os.totalmem();
    const freeMemory = os.freemem();
    res.json([{ CPU: cpuInfo }, { totalMemory: totalMemory, freeMemory: freeMemory }]);
});
const API_URL = process.env.API_URL;
const Request_Interval = 120000; // milliseconds
const PORT = process.env.PORT || 80; // port number
const startTimeStamp = Date.now() + new Date().getTime();
const endTimeStamp = startTimeStamp + (60 * 60 * 1000);

const krajId = 116;
const stavIds = [210, 400, 410, 420, 430, 440, 500, 510, 520, 600, 610, 620, 700, 710, 750, 760, 780, 800];
const background = true;

let FetchedIncidents = [];
const refresh = () => {
    const currentDate = new Date();
    const oneHourAgo = new Date(currentDate.getTime() - 100 * 60 * 1000); // Subtract 60 minutes in milliseconds

    const formattedDate = oneHourAgo.toISOString();
    const formattedDate2 = currentDate.toISOString();

    const queryParams = `casOd=${encodeURIComponent(formattedDate)}&casDo=${encodeURIComponent(formattedDate2)}&krajId=${krajId}&background=${background}&stavIds=${stavIds.join('&stavIds=')}`;
    console.log(`Sending request to the server...`);
    axios.get(`${API_URL}?${queryParams}`)
    .then(response => {
        const incidents = response.data;

        incidents.forEach(incident => {
            if (!FetchedIncidents.includes(incident.casOhlaseni)) {
                console.log(`${API_URL}udalosti/id/technika`);
                axios.get(`${API_URL}udalosti/${incident.id}/technika`).then(response => {
                    var FireUnitsInfo = response.data;
                    webhook.sendMessage(incident , FireUnitsInfo);
                }).catch(error => {
                    console.log(`There was an error`);
                    webhook.sendMessage(incident , FireUnitsInfo);
                });
                console.log(`---`);
                console.log(`Incident ID ${incident.id}`);
                console.log(`Timestamp of Report: ${incident.casOhlaseni}`);
                console.log(`Description: ${incident.poznamkaProMedia}`);
                console.log(`Location: ${incident.obec}`);
                console.log('---');
                //webhook.sendMessage(incident , FireUnitsInfo);
                FetchedIncidents.push(incident.casOhlaseni);
            }
        });
    })
    .catch(err => {
        console.error(err);
    });
}

const AutoRefreshData = () => {
    // Clearing the Array to prevent using too much memory
    var currentTime = new Date();
    var midnight = new Date();
    midnight.setHours(0,0,0,0);
    if (currentTime.getTime() === midnight.getTime()) {
        FetchedIncidents = [];
        console.log(`[DEBUG]` + `[${currentTime.getHours()}][${currentTime.getMinutes()}][${currentTime.getSeconds()}] callouts cleared.`);
    }
}

setInterval(refresh, Request_Interval);
setInterval(() => {
    AutoRefreshData();
}, 1000 * 60);

app.listen(PORT , () => {
    console.log(`[SERVER] Web Server is running on ${PORT}`);
});