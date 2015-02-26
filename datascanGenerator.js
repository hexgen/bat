var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Baby = require('babyparse');

var MongoClient = require('mongodb').MongoClient;
var DBurl = 'mongodb://192.168.10.170:27017/bat512';

var CSVConfig = {header: true};
var dataPath = __dirname;

function scanFiles(dataDir)
{
    console.log('Scanning ... ' + dataDir);
    return fs.readdirSync(dataDir);
}

function readCSVFile(file)
{
    console.log('Parsing file: ' + file);
    return fs.readFileSync(
        path.join(dataPath, file),
        {encoding: 'utf-8'}
    );
}

function insertDocuments(db, name, data, callback)
{
    console.log(name + ' [' + data.length + ']');
    var collection = db.collection(name);
    collection.drop();
    // Get the document
    // nts collection

    collection.insert(
        data,
        function (err, result)
        {
            assert.equal(err, null);
            console.log(name + ' finished');
            if (callback !== undefined) {
                callback(result);
            }
        });
}

function *generator() {
    var result;
    dir = path.join(dataPath, 'data');
    result = yield scanFiles(dir);
    var files = {};
    result.forEach(function (file) {
        console.log(path.join('data', file));
        var shortName = file.split(path.sep).pop();
        var name = shortName.substr(0, shortName.length - 4);
        files[name] = readCSVFile(path.join('data', file));
    });
    //console.log(Object.keys(files));
    result = yield files;

    var parsed = {};
    Object.keys(result).forEach(function (key) {

        parsed[key] = Baby.parse(result[key], CSVConfig).data;
    });
    //console.log(Object.keys(parsed));
    result = yield parsed;

    Object.keys(result).forEach(function (name) {
        console.log(name);
        
        MongoClient.connect(
            DBurl,
            function (err, db)
            {
                assert.equal(null, err);
                console.log("Connected to the MongoDB ");
                insertDocuments(
                    db,
                    name,
                    result[name],
                    function (result)
                    {
                        db.close();
                        console.log(result.length
                        + ' documents successfully inserted');
                        console.log('db closed ');
                    }
                );

            }
        );
    });
}

function main() {
    var v = generator();
    var genResult = null;
    var genValue = null;
    var genDone = false;
    while(!genDone) {
        genResult = v.next(genValue);
        genValue = genResult.value;
        genDone = genResult.done;
    }
}

main();
