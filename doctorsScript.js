function thunkify(nodefn) {
    return function () {
        var args = Array.prototype.slice.call(arguments)
        return function (cb) {
            args.push(cb)
            nodefn.apply(this, args)
        }
    }
}

function run(genFn) {
    var gen = genFn()
    next()

    function next(er, value) {
        if (er) return gen.throw(er)
        var continuable = gen.next(value)
        if (continuable.done) return
        var cbFn = continuable.value
        cbFn(next)
    }
}

var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dbConnect = thunkify(MongoClient.connect);

var url = 'mongodb://192.168.10.170:27017/wepo_company_zoho_bk_26_02_15';

var findDocuments = function (db, collectionName, callback) {
    var collection = db.collection(collectionName);
    collection.find({}).toArray(function (err, docs) {
        assert.equal(err, null);
        callback(err, docs);
    });
}

var findOne = function (db, collection, where, callback) {
    var collection = db.collection(collection);
    collection.findOne(where, function (err, item) {
        assert.equal(err, null);
        callback(err, item);
    });
}

var insert = function (db, table, item, callback) {
    var collection = db.collection(table);
    collection.insert(item, function (err, doc) {
        assert.equal(err, null);
        callback(err, doc);
    });
}

var update = function (db, table, item, callback) {
    var collection = db.collection(table);
    collection.update(item, function (err, doc) {
        assert.equal(err, null);
        callback(err, doc);
    });
}

var save = function (db, table, item, callback) {
    var collection = db.collection(table);
    collection.save(item, {}, function (err, doc) {
        assert.equal(err, null);
        callback(err, doc);
    });
}

var findOneSync = thunkify(findOne);
var insertSync = thunkify(insert);
var updateSync = thunkify(update);
var saveSync = thunkify(save);
var findDocumentsSync = thunkify(findDocuments);

run(function* () {
    try {
        var dateStart = new Date();
        var db = yield dbConnect(url);
        var documents = yield findDocumentsSync(db, 'Patient');
        var i = 0;
        for (var doc of documents) {
            //if (i >= 10) break
            //++i;
            if (doc.dea) {
                //console.log(i + "/" + documents.length, doc.dea);
                var doctor = yield findOneSync(db, 'Doctor', {'dea':doc.dea});
                //console.log(doctor);
                if (doctor != null) {
                    doc['doctor_prog_id'] = doctor['_id'];
                    doc['doctor_prog_title'] = doctor['title'];
                    doc['doctor_prog_license'] = doctor['license'];
                    doc['doctor_prog_dea'] = doctor['dea'];
                    doc['doctor_prog_phone'] = doctor['phone'];
                    doc['doctor_prog_fax'] = doctor['fax'];
                    doc['doctor_prog_city'] = doctor['city'];
                    doc['doctor_prog_state'] = doctor['state'];
                    doc['doctor_prog_country'] = doctor['country'];
                    doc['doctor_prog_zip'] = doctor['zip'];
                    doc['doctor_prog_address'] = doctor['address'];
                }
            }
            if (doc['npi_№']) {
                //console.log(i + "/" + documents.length, doc['npi_№']);
                var doctor = yield findOneSync(db, 'Doctor', {'npi':doc['npi_№']});
                //console.log(doctor);
                if (doctor != null) {
                    doc['doctor_lab_id'] = doctor['_id'];
                    doc['doctor_lab_title'] = doctor['title'];
                    doc['doctor_lab_npi'] = doctor['npi'];
                    doc['doctor_lab_phone'] = doctor['phone'];
                    doc['doctor_lab_fax'] = doctor['fax'];
                    doc['doctor_lab_city'] = doctor['city'];
                    doc['doctor_lab_state'] = doctor['state'];
                    doc['doctor_lab_country'] = doctor['country'];
                    doc['doctor_lab_zip'] = doctor['zip'];
                    doc['doctor_lab_address'] = doctor['address'];
                }
            }

            //if (doc['asap']) {
            //    ++i;
            //    console.log(i + "/" + documents.length, doc['asap']);
                //var doctor = yield findOneSync(db, 'Doctor', {'npi':doc['npi_№']});
                //console.log(doctor);
                //if (type != null) {
                //    console.log('Note' + type);
                //    notes['Note' + type].push(doc);
                //}
            //}
            yield saveSync(db, 'Patient', doc);
        }
        //console.log(i);
        //yield insertSync(db, 'Patient3', documents);
        db.close();
        var dateEnd = new Date();
        var seconds = (dateEnd.getTime() - dateStart.getTime())/1000;
        console.log('Script execution time is '+seconds+' seconds');
    }
    catch (er) {
        console.error(er);
    }
})