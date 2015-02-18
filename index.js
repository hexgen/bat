var Baby = require('babyparse');
var fs = require('fs');
var path = require('path');
var MongoClient = require('mongodb').MongoClient, assert = require('assert');
var url = 'mongodb://192.168.10.170:27017/bat';

var filePath = path.join(__dirname, 'data/Contacts1.csv');
config = {
    header: true
};

var insertDocuments = function (db, data, callback) {
    // Get the documents collection
    var collection = db.collection('documents');
    // Insert some documents
    collection.insert(
        data,
        function (err, result) {
            assert.equal(err, null);
            console.log("Inserted documents into the document collection");
            callback(result);
        });
}

fs.readFile(filePath, {encoding: 'utf-8'}, function (err, data) {
    if (!err) {
        parsed = Baby.parse(data, config);
        MongoClient.connect(url, function (err, db) {
            assert.equal(null, err);
            console.log("Connected correctly to server");
            insertDocuments(db, parsed.data, function () {
                db.close();
            });
        });
    } else {
        console.log(err);
    }

});