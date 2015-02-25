var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var url = 'mongodb://192.168.10.170:27017/wepo_company_zoho_node';
var count = 0;
var iNum = 0;

var findType = function (id, callback) {
    console.log("findType", {"zoho_id": id});
    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        var collection = db.collection('AllId');
        collection.findOne({zoho_id: id}, function (err, item) {
            assert.equal(err, null);
            db.close()
            callback(item.type);
        });
    });
}

var parseNotes = function (items, callback) {
    //console.dir(items)
    //console.dir(srcDb)
    console.log(count = items.length);
    items.forEach(
        function (item) {
            console.log('[' + (++iNum) + '/' + count + ']');
            findType(item._id_export, function (type) {
                insert2Db('Note' + type, item);
            })

        });
    callback();

}

var insert = function (db, name, data, callback) {
    var collection = db.collection(name);
    collection.insert(data,
        function (err, result) {
            assert.equal(err, null);
            callback(result);
        });
}

var insert2Db = function (name, item) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(err, null);
        insert(db, name, item, function () {
            db.close()
        })
    })
}

var findDocuments = function (db, callback) {
    // Get the documents collection
    var collection = db.collection('Note');
    // Find some documents
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        //assert.equal(6, docs.length);
        //console.log("Found the following records");
        //console.dir(docs)
        callback(docs);
    });
}

function main() {

// Use connect method to connect to the Server
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        console.log("Connected correctly to server");
        srcDb = db;
        findDocuments(db,
            function (items) {
                console.log('db close');
                db.close();
                parseNotes(items, function () {
                    console.log('finish')
                });
            });
    });
}


main();

