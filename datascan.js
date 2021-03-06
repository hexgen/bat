var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Baby = require('babyparse');

var MongoClient = require('mongodb').MongoClient;
var DBurl = 'mongodb://192.168.10.170:27017/bat2';

var CSVConfig = {header: true};
var dataPath = __dirname;

function scanFiles(dataDir, callback)
{
    console.log('Scanning ... ' + dataDir);
    fs.readdir(
        dataDir,
        function (err, files)
        {
            assert.equal(err, null);
            if (callback !== undefined) {
                callback(files);
            }
        }
    );
}

function parseCsvFiles(files, db)
{
    console.log('Got ', files);
    files
        .filter(function (file)
        {
            return fs.statSync(path.join(dataPath, file)).isFile()
                && file.match(/\.csv$/);
        })
        .forEach(function (file)
        {
            parseCsvFile(file, db);
        });
}

function readCSVFile(file, callback)
{
    console.log('Parsing file: ' + file);
    fs.readFile(
        path.join(dataPath, file),
        {encoding: 'utf-8'},
        function (err, stream)
        {
            assert.equal(err, null);
            if (callback !== undefined) {
                return callback(stream);
            }
            return [];
        }
    );
}

function parseCSVStream(stream, callback)
{
    console.log('Processing CSV Stream');
    var parsed = Baby.parse(stream, CSVConfig);
    var data = parsed.data.filter(function (item)
    {
        if (Object.keys(item).length > 1) {
            return true;
        }
        if (Object.keys(item).length < 1) {
            return false;
        }
        if (item[Object.keys(item)[0]].trim().length) {
            return false;
        }
//        console.log(item, Object.keys(item).length);
    });
    if (callback !== undefined) {
        return callback(data);
    }

    return data;
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

function importFile(fileName)
{
    var shortName = fileName.split(path.sep).pop();

    assert.equal(
        fs.statSync(path.join(dataPath, 'data', shortName)).isFile(), true
    );
    assert.notEqual(
        shortName.match(/\.csv$/), null
    );

    var name = shortName.substr(0, shortName.length - 4);

    readCSVFile(
        fileName,
        function (stream)
        {
            return parseCSVStream(stream, function (data)
            {
                console.log('Documents: ' + data.length);
                MongoClient.connect(
                    DBurl,
                    function (err, db)
                    {
                        assert.equal(null, err);
                        console.log("Connected to the MongoDB ");
                        insertDocuments(
                            db,
                            name,
                            data,
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

            })

        }
    );
}

if (process.argv.indexOf('--list') >= 0) {
    scanFiles(path.join(dataPath, 'data'), function (files)
    {
        console.log(files)
    });
    return;
}

if (process.argv.indexOf('--all') >= 0) {
    scanFiles(path.join(dataPath, 'data'), function (files)
    {
        files.filter(function (file)
        {
            return file.match(/\.csv$/);
        }).forEach(function (file)
        {
            importFile(path.join('data', file));
        });
        console.log(files)
    });

    return;
}

if (nFile = process.argv.indexOf('--file') >= 0) {
    var fileName = process.argv[nFile + 2];
    importFile(fileName);

    return;
}

console.log('use');
console.log('      --list');
console.log('      --file File.csv');
console.log('      --all');

//MongoClient.connect(
//    DBurl,
//    function (err, db) {
//        assert.equal(null, err);
//        console.log("Connected to the MongoDB ");
//        scanFiles(dataPath, db);
//        //db.close();
//    }
//);
