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

var findType = function (db, id, callback) {
    var collection = db.collection('AllId');
    collection.findOne({zoho_id: id}, function (err, item) {
        assert.equal(err, null);
        var result = null;
        if (item != null) {
            result = item.type;
        }
        callback(err, result);
    });
}

var saveNote = function (db, table, item, callback) {
    var collection = db.collection(table);
    collection.insert(item, function (err, doc) {
        assert.equal(err, null);
        callback(err, doc);
    });
}

var findTypeSync = thunkify(findType);
var saveNoteSync = thunkify(saveNote);
var findDocumentsSync = thunkify(findDocuments);

run(function* () {
    try {
        var db = yield dbConnect(url);
        var documents = yield findDocumentsSync(db, 'Note');
        var i = 0;
        var notes = [];
        notes['NoteLead'] = [];
        notes['NotePatient'] = [];
        for (var doc of documents) {
            //if (i >= 3) break
            if (doc.target) {
                console.log(++i + "/" + documents.length, "id = " + doc.target);
                var type = yield findTypeSync(db, doc.target);
                if (type != null) {
                    console.log('Note' + type);
                    notes['Note' + type].push(doc);
                }
            }
        }
        for (var tableName in notes) {
            if (notes[tableName].length>0) {
                var res = yield saveNoteSync(db, tableName, notes[tableName]);
            }
            if (res != null) {
                console.log(tableName + 'are saved');
            }
        }
        db.close();
    }
    catch (er) {
        console.error(er);
    }
})