/**
 * Created by vlad on 24.02.15.
 */
var db,engine;

// load config
var config = require('./config');

// load requestd engine and define engine-agnostic getDB function
if (config.app.engine=="mongodb") {
    engine = require("mongodb");
    module.exports.getDB = function () {
        if (!db) db = new engine.Db(config.mongo.db,
            new engine.Server(config.mongo.host, config.mongo.port, config.mongo.opts),
            {native_parser: false, safe:true});
        return db;
    }
} else {
    engine = require("tingodb")({});
    module.exports.getDB = function () {
        if (!db) db = new engine.Db(config.tingo.path, {});
        return db;
    }
}
// Depending on engine, this can be a different class
module.exports.ObjectID = engine.ObjectID;
