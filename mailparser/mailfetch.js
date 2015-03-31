/**
 * Created by nostro on 31.03.15.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.10.170:27017/wepo_company_acl');
var Schema = mongoose.Schema;

//var mailSettingSchema = new Schema({
//  setting_user:  String,
//  author: String,
//  body:   String,
//  comments: [{ body: String, date: Date }],
//  date: { type: Date, default: Date.now },
//  hidden: Boolean,
//  meta: {
//    votes: Number,
//    favs:  Number
//  }
//});

var msSchema = new Schema({
    //_id : ObjectId,
    //email : String,
    //"setting_user": String,
    //"setting_protocol_id" : String,
    //"setting_host" : String,
    //"setting_port" : String,
    //"setting_security_id" : String,
    //"pass": String,
    //"owner_id" : ObjectId,
    //"user_id" : ObjectId,
    //"status_id" : ObjectId,
    //"owner" : String,
    //"user" : String,
    //"status" : String,
    //"type" : String,
    "title" : String
    //"setting_protocol_title" : String,
    //"setting_security_title" : String,
    //"owner_title" : String,
    //"user_title" : String,
    //"status_title" : String,
    //"_acl" : Array
});

var ms = mongoose.model('Troop', msSchema, 'Troop');

var small = new ms({ title: 'small' });
small.save(function (err) {
    if (err) return console.log(err);
    // saved!
});


//console.log(ms);

//query = ms.find({});
//query.select('setting_user pass');
//query.exec(function (err, mailSettings) {
//    //if (err) return handleError(err);
//    console.log('Count',mailSettings);
//});
//ms.find({'setting_user': 'vladimir.pasechnik@gmail.com'}).select('setting_user pass').exec(function (err, mailSettings) {
//    //if (err) return handleError(err);
//    console.log('Count', mailSettings);
//});

ms.find({}, function (err, docs) {
    if (err) return console.log(err);
    console.log('Count', docs);
});