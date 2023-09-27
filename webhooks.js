const axios = require('axios');
const webhook_url = process.env.WEBHOOK_URL;
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: webhook_url });
const FireIconUrl = "https://scontent.fprg1-1.fna.fbcdn.net/v/t39.30808-6/308660296_458415059646611_5759471644398264944_n.jpg?_nc_cat=105&ccb=1-7&_nc_sid=a2f6c7&_nc_ohc=Hkm5MsDfVAUAX8e6-lN&_nc_ht=scontent.fprg1-1.fna&oh=00_AfDBYpYQ8uME6IujO4rvjkUC_U6Jy60ZgfpsF51BRRdwNA&oe=64F73036";
const googleMaps = require('./googleMaps');
const sendMessage = async (incident, FireUnitsInfo) => {
    try {
        //LOCATION
        const GoogleMapsParams = googleMaps.getUrl(incident.obec , incident.ulice , incident.silnice);
        var road = incident.silnice;
        if (road == null) { road = ":x:"; }
        var EventName = getEventType(incident.typId);
        var SubEventName = getSubEventType(incident.podtypId); 
        var dateObject = new Date(incident.casOhlaseni);
        var street = incident.ulice;
        if (street == null) { street = ""; }

        const options = {
            year: 'numeric', 
            month: 'long', 
            day: 'numeric', 
            hour: '2-digit', 
            minute: '2-digit', 
            second: '2-digit', 
            timeZoneName: 'long'
        }
        const embed = new EmbedBuilder()
        .setTitle(`${EventName} : ${SubEventName}`)
        .setColor(hexToDecimal("#fc2003"))
        .setAuthor({ name: "FireBrno", url: "https://udalosti.firebrno.cz/", iconUrl: FireIconUrl }) // Firefighters from Brno are the source of informations
        .addFields(
            { name: `:notepad_spiral:`, value: `${incident.poznamkaProMedia}` },
            { name: `:fire_engine: Výjezdová jednotka(ORP): ${incident.ORP}`, value: ` ` },
            { name: `:calendar: ${dateObject.toLocaleDateString('cs-CZ', options)}`, value: ` ` },
            { name: `:map: ${incident.obec} ${street}`, value: ` `},
            { name: `:motorway:Silnice: ${road}`, value: ` ` },
            { name: `<:google_maps_icon:1147865189073563648> Google Maps `, value: `[Google Maps](https://www.google.com/maps?q=${GoogleMapsParams})` },
            { name: `ID Výjezdu: ${incident.id}`, value: `Pro detailní zobrazení výjezdu` },
            { name: `:fire_engine: Vozidla / Technika`, value: ` `},
        )
        ;
        /*if (!FireUnitsInfo === null) {
            for (var unit of FireUnitsInfo) {
                console.log(unit);
                embed.addFields(
                    { name: `${unit.jednotka}` , value: `Typ: ${unit.typ}` }
                )
            }
        }*/
        if (FireUnitsInfo !== null) {
            FireUnitsInfo.forEach(unit => {
                console.log(unit);
                embed.addFields(
                    { name: `:fire_engine: ${unit.jednotka}` , value: `Typ: ${unit.typ} ${unit.casOhlaseni}` }
                )
            });
        }
        else {
            console.log(`Unit is null`);
        }
    await webhookClient.send({
        content: "@everyone",
        username: "PlamenZvon",
        embeds: [ embed ],
    })
    }
    catch (err) {
        console.log(err);
    }
}

const hexToDecimal = (hex) => {
    return parseInt(hex.replace("#", ""), 16);
}

const getEventType = (eventId) => {
    switch (eventId) {
        case 3100:
            return ":fire:Požár"; // Fire
        break;
        case 3200:
            return "Dopravní nehoda"; // Vehicle Incident
        break;
        case 3400:
            return "Únik nebezpečných látek"; 
        break;
        case 3500:
            return ":wrench:Technická pomoc"; // Technical help
        break;
        case 3550:
            return "Záchrana osob a zvířat";
        break;
    }
}

const getSubEventType = (subeventId) => {
    switch (subeventId) {
        case 3101:
            return "Nízké budovy";
        break;
        case 3103:
            return "Průmyslové, zemědělské objekty, sklady";
        break;
        case 3109:
            return "Popelnice, kontejner";
        break;
        case 3106:
            return "Polní porost, tráva";
        break;
        case 3108:
            return "Dopravní prostředky";
        break;
        case 3111:
            return "Odpad, ostatní";
        break;
        case 3211:
            return "Vyproštění osob";
        break;
        case 3212:
            return "Uvolění komunikace, odtažení";
        break;
        case 3213:
            return ":broom:Úklid vozovky";
        break;
        case 3214:
            return ":stethoscope:Se zraněním";
        break;
        case 3523:
            return "Uzvařené prostory, výtah";
        break;
        case 3527:
            return "Čerpání vody";
        break;
        case 3401:
            return "Na pozemní komunikaci";
        break;
        case 3402:
            return "Do půdy";
        break;
        case 3404:
            return "Do ovzduší";
        break;
        case 3501:
            return "Odstranění nebezpečných stavů";
        break;
        case 3502:
            return "Spolupráce ze složkama IZS";
        break;
        case 3505:
            return ":evergreen_tree:Odstranění stromu";
        break;
        case 3521:
            return ":droplet:Z Vody";
        break;
        case 3528:
            return ":test_tube:Měření koncentrací";
        break;
        case 3528:
            return "";
        break;
        case 3529:
            return "Z hloubky";
        break;
        case 3530:
            return "AED";
        break;
        case 3534:
            return ":hospital:Transport pacienta";
        break;
        case 3543:
            return "Transport pacienta";
        break;
    }
}

module.exports =  { sendMessage };