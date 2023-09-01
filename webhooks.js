const axios = require('axios');
const webhook_url = process.env.WEBHOOK_URL;
const { EmbedBuilder, WebhookClient } = require('discord.js');
const webhookClient = new WebhookClient({ url: webhook_url });

const sendMessage = async (incident) => {
    try {
        /*const embed = new EmbedBuilder()
        .setTitle("Hasičský Výjezd")
        .setAuthor({ name: "PlamenZvon" })
        .setColor(hexToDecimal("#fc2003"))
        .addFields(
            { name: ":notepad_spiral:", value: `${incident.id}` },
            { name: ":calendar:", value: `${incident.casOhlaseni}` },
            { name: ":map:", value: `${incident.obec}` },
            { description: `${incident.poznamkaProMedia}` }
        );*/
        const dateObject = new Date(incident.casOhlaseni);
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
        .setTitle("Hasičský výjezd")
        .setDescription(`:notepad_spiral: ${incident.poznamkaProMedia}`)
        .setColor(hexToDecimal("#fc2003"))
        .setAuthor({ name: "FireBrno", url: "https://udalosti.firebrno.cz/" })
        .addFields(
            { name: `:calendar: ${dateObject.toLocaleDateString('cs-CZ', options)}`, value: ` ` },
            { name: `:map: ${incident.obec}`, value: ` ` },
        )
        ;

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

module.exports =  { sendMessage };