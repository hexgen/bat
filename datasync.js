/**
 * Created by vlad on 24.02.15.
 */

var co = require('co')
var Hash = require('hashish')
var Seq = require('seq')
var assert = require('assert')
var Db = require('mongodb').Db
//var MongoClient = require('mongodb').MongoClient
var Server = require('mongodb').Server

var zohoDb;
var zohoIp = '192.168.10.170'
var zohoPort = 27017
var zohoDbName = 'zoho_csv';
var wepoDbName = 'wepo_company_zoho';

var engine = require('./engine');
var zohoDb = engine.getDB();
console.log(db);

function dbopen ()
{
    db.open(function(err, db) {
}

Seq().seq(function)
db.open()
//var zohoDb = new Db(zohoDbName, new Server(zohoIp, zohoPort), {safe:false});

//Seq()
//    .seq(function(){
//        console.log('The begin: ')
//        zohoDb.open(this);
//
//    })
//    .seq(function(db){
//        zohoDb = db;
//        db.collection('export_wepo_settings').find( this );
//        this(db);
//    })
//    .seq(function(item){
//        console.log(item);
//        zohoDb.close();
//        console.log('The end!')
//    })


db.close();
