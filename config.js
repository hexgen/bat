'use strict';

var version = require('./package.json').version;
var config ={
    version: version,
    debug: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 7001,
    app:{
        engine: 'mongodb'
    },
    mongo:{
        host: "127.0.0.1",
        "port": 27017,
        "db":"zoho_csv",
        "opts":
        {
            "auto_reconnect": true,
            "safe": true
        }
    },
    "tingo":{
        "path":"./data"
    }
};

module.exports = config;


