const fs = require('fs');
const yaml = require('js-yaml');
var config;

try {
    const config_file = yaml.load(fs.readFileSync("./config/config.yml", "utf-8"));
    config = config_file;
}
catch (e) {
    console.log(`[CONFIG-ERROR]: An error occurred while loading the config file ${e.message}`);
    config = {app: {port: 81}, ntfy: {allowed: false}}
}

module.exports = { config };