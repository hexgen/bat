function thunkify(nodefn) { // [1]
    return function () { // [2]
        var args = Array.prototype.slice.call(arguments)
        return function (cb) { // [3]
            args.push(cb)
            nodefn.apply(this, args)
        }
    }
}

function run(genFn) {
    var gen = genFn() // [1]
    next() // [2]

    function next(er, value) { // [3]
        if (er) return gen.throw(er)
        var continuable = gen.next(value)

        if (continuable.done) return // [4]
        var cbFn = continuable.value // [5]
        cbFn(next)
    }
}

var fs = require('fs')
var readFile = thunkify(fs.readFile)

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dbConnect = thunkify(MongoClient.connect)

var url = 'mongodb://192.168.10.170:27017/wepo_company_zoho_node';

var findDocuments = function (db, collectionName, callback) {
    var collection = db.collection(collectionName);
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(err, docs);
    });
}

//var findType = function (id, callback) {
//    console.log("findType", {"zoho_id": id});
//    MongoClient.connect(url, function (err, db) {
//        assert.equal(err, null);
//        var collection = db.collection('AllId');
//        collection.findOne({zoho_id: id}, function (err, item) {
//            assert.equal(err, null);
//            db.close()
//            callback(item.type);
//        });
//    });
//}

var findType = function (db, id, callback) {
    //console.log("findType", {"zoho_id": id});

    var collection = db.collection('AllId');
    collection.findOne({zoho_id: id}, function (err, item) {
        assert.equal(err, null);
        //console.log("Item Type", item.type);
        callback(err, item.type);
    });

}

var findTypeAndSave = function (db, documents, callback) {
    console.log("findTypeAndSave started");

    var collection = db.collection('AllId');
    //try {
        for (var doc of documents) {
            collection.findOne({zoho_id: doc._id_export}, function (err, item) {
                assert.equal(err, null);
                //var newCollection = db.collection(item.type);
                console.log(item.type);
                //callback(err, item.type);
            });
        }
    //}
    //catch (er) {
    //    console.error(er)
        //while(!genDone) {
        //    genResult = v.next(genValue);
        //    genValue = genResult.value;
        //    genDone = genResult.done;
        //}
    //}
    var er = Error;
    callback(er, 'Success');
}

var findTypeSync = thunkify(findType);
var findTypeAndSaveSync = thunkify(findTypeAndSave);

var findDocumentsSync = thunkify(findDocuments);


run(function* () {
    try {
        var db = yield dbConnect(url);
        //var file = yield readFile('./LeadsPart.csv', {encoding: 'utf-8'});
        var documents = yield findDocumentsSync(db, 'User');
        //for (var doc of documents) {
        //    var type = yield findTypeSync(db, doc._id_export);
        //    console.log(type);
        //}
        //result

        //console.log("Document 0",documents[1]);
        //var result1  = yield findTypeSync(db, documents[1]._id_export);
        //console.log("Result1", result1);
        var result = [];
        for(var doc of documents){
            if(doc._id_export){
                console.log(doc._id_export);
                result[doc._id_export]  = yield findTypeSync(db, doc._id_export);
            }
        }
        //yield result;
        console.log(result);
        db.close();
        //console.log(file);
    }
    catch (er) {
        console.error(er)
    }
})