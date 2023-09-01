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

const API_URL = process.env.API_URL;
const Request_Interval = 10000; // milliseconds
const PORT = process.env.PORT || 80; // port number
const startTimeStamp = Date.now() + new Date().getTime();
const endTimeStamp = startTimeStamp + (60 * 60 * 1000);

const krajId = 116;
const stavIds = [210, 400, 410, 420, 430, 440, 500, 510, 520, 600, 610, 620, 700, 710, 750, 760, 780, 800];
const background = true;
const casOd = "2023-08-22T22:00:00.000Z";
const casDo = "2023-08-23T21:59:59.999Z";

const refresh = () => {
    const currentDate = new Date();
    const tenMinutesAgo = new Date(currentDate.getTime() - 10 * 60 * 1000); // Subtract 10 minutes in milliseconds

    const formattedDate = tenMinutesAgo.toISOString();
    const formattedDate2 = currentDate.toISOString();

    const queryParams = `casOd=${encodeURIComponent(formattedDate)}&casDo=${encodeURIComponent(formattedDate2)}&krajId=${krajId}&background=${background}&stavIds=${stavIds.join('&stavIds=')}`;
    console.log(`Sending request to the server...`);
    axios.get(`${API_URL}?${queryParams}`)
    .then(response => {
        const incidents = response.data;

        incidents.forEach(incident => {
            console.log(`Incident ID ${incident.id}`);
            console.log(`Timestamp of Report: ${incident.casOhlaseni}`);
            console.log(`Description: ${incident.poznamkaProMedia}`);
            console.log(`Location: ${incident.obec}`);
            console.log('---');
            webhook.sendMessage(incident);
        });
    })
    .catch(err => {
        console.error(err);
    });
}

setInterval(refresh, Request_Interval);

app.listen(PORT , () => {
    console.log(`Server is running on ${PORT}`);
});