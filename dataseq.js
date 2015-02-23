/**
 * Created by vlad on 23.02.15.
 */
var fs = require('fs');
var path = require('path');
var assert = require('assert');
var Baby = require('babyparse');

var MongoClient = require('mongodb').MongoClient;
var DBurl = 'mongodb://192.168.10.170:27017/bat2';

var CSVConfig = {header: true};
var dataPath = __dirname;

var Hash = require('hashish');
var Seq = require('seq');

Seq()
    .seq('db', function ()
    {
        MongoClient.connect(
            DBurl,
            this
        );
    })
    .seq('db',function(){
        console.log(this.stack);
    })
    .seq('files', function ()
    {
        fs.readdir(path.join(dataPath, 'data'), this);
    })

    .seq('files',function () {

        console.log(this.stack);
    })
//    .seq(function ()
//    {
//        console.log(this.vars['db']);
//    })
//    .flatten()
//    .parEach(function (file) {
//        fs.readFile(
//            path.join(dataPath, 'data', file),
//            {encoding:
//                'utf-8'},
//            this.into(file)
//        );
//    })
//    .parEach(function (key) {
//        var parsed = Baby.parse(this.vars[key], CSVConfig);
//        this.vars[key] = parsed.data;
//    })
//    .parEach(function(key){
//        console.log(key, this.vars[key]);
//    })
//    .seq(function () {
//        console.log(this.vars);
////        var sizes = Hash.map(this.vars, function (s) { return s.size })
////        console.dir(sizes);
//    })
;
