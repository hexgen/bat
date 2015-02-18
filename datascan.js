var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Baby = require('babyparse');

var MongoClient = require('mongodb').MongoClient;
var DBurl = 'mongodb://192.168.10.170:27017/bat';
var db = null;

var CSVConfig = {header: true};
var dataPath = path.join(__dirname, 'data');

function scanfiles(dataDir, db) {
    console.log('Scanning ... ' + dataDir);
    fs.readdir(
        dataDir,
        function (err, files) {
            assert.equal(err, null);
            parseCsvFiles(files, db);
        }
    );
}

function parseCsvFiles(files, db) {
    console.log('Got ', files);
    files
        .filter(function (file) {
            return fs.statSync(path.join(dataPath, file)).isFile() && file.match(/\.csv$/);
        })
        .forEach(function (file) {
            parseCsvFile(file, db);
        });
}

function parseCsvFile(file, db) {
    var name = file.substr(0, file.length - 4);
    console.log('Processing: ' + file + ' -> ' + name);
    fs.readFile(
        path.join(dataPath, file),
        {encoding: 'utf-8'},
        function (err, data) {
            assert.equal(err, null);
            parseCSVData(db, name, data);
        }
    );
}

function parseCSVData(db, name, data) {
    console.log('Processing CSV Data ' + name);
    var parsed = Baby.parse(data, CSVConfig);
    insertDocuments(db, name, parsed.data);
}

function insertDocuments(db, name, data) {
    console.log(name + ' [' + data.length + ']');
    var collection = db.collection(name);
    collection.drop();
    // Get the document
    // nts collection

    // Insert some documents
    collection.insert(
        data,
        function (err, result) {
            assert.equal(err, null);
            console.log("Inserted into the " + name + " collection ");
        });
}


MongoClient.connect(
    DBurl,
    function (err, db) {
        assert.equal(null, err);
        console.log("Connected to the MongoDB ");
        scanfiles(dataPath, db);
        //db.close();
    }
);



