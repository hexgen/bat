/**
 * Created by nostro on 31.03.15.
 */

var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.10.170:27017/wepo_company_acl');
var Schema = mongoose.Schema;
var Imap = require('imap');
var inspect = require('util').inspect;

var msSchema = new Schema({
    //_id : ObjectId,
    email: String,
    setting_user: String,
    //setting_protocol_id: String,
    setting_host: String,
    setting_port: String,
    //setting_security_id: String,
    pass: String
    ////owner_id: ObjectId,
    ////user_id: ObjectId,
    ////status_id: ObjectId,
    //owner: String,
    //user: String,
    //status: String,
    //type: String,
    //title: String,
    //setting_protocol_title: String,
    //setting_security_title: String,
    //owner_title: String,
    //user_title: String,
    //status_title: String,
    //_acl: Array
});

var mailRawSchema = new Schema({
    "_acl": Array,
    "protocol_ids": Array,
    "message_id": String,
    "raw_headers": String,
    "raw_content": String,
    "is_converted": Boolean,
    "converted_mail": {
        "text": String,
        "header": {
            "return-path": String,
            "message-id": String,
            "date": Date,
            "from": Array,
            "to": Array,
            "subject": String,
            "sender": String
        },
        "link": Array
    },
    "error": Array
});

//var small = new ms({title: 'small'});
//small.save(function (err) {
//    if (err) return console.log(err);
//    // saved!
//});


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


function main() {
    var mailRaw = mongoose.model('MailRaw', mailRawSchema, 'MailRaw');
    mailRaw.find({}).limit(5).exec(function(err, docs){ console.dir(docs)});
    return;

    var ms = mongoose.model('MailReceiveSetting', msSchema, 'MailReceiveSetting');
    ms.find({}, function (err, docs) {
        if (err) return console.log(err);
        console.dir(docs);
        return;
        docs.forEach(function (doc) {
            var userMs = new ms(doc);

            console.log({
                user: userMs.setting_user,
                password: userMs.pass,
                host: userMs.setting_host,
                port: userMs.setting_port,
                tls: true
            });
            var imap = new Imap({
                user: userMs.setting_user,
                password: userMs.pass,
                host: userMs.setting_host,
                port: userMs.setting_port,
                tls: true
            });
            imap.connect();
            imap.once('ready', function () {
                imap.openBox('INBOX', true, function (err, box) {
                    if (err) throw err;
                    var f = imap.seq.fetch(box.messages.total + ':*', {bodies: ['HEADER.FIELDS (FROM)', 'TEXT']});
                    f.on('message', function (msg, seqno) {
                        console.log('Message #%d', seqno);
                        var prefix = '(#' + seqno + ') ';
                        msg.on('body', function (stream, info) {
                            if (info.which === 'TEXT')
                                console.log(prefix + 'Body [%s] found, %d total bytes', inspect(info.which), info.size);
                            var buffer = '', count = 0;
                            stream.on('data', function (chunk) {
                                console.log('123', chunk);
                                //count += chunk.length;
                                //buffer += chunk.toString('utf8');
                                //if (info.which === 'TEXT')
                                //    console.log(prefix + 'Body [%s] (%d/%d)', inspect(info.which), count, info.size);
                            });
                            stream.once('end', function () {
                                if (info.which !== 'TEXT')
                                    console.log(prefix + 'Parsed header: %s', inspect(Imap.parseHeader(buffer)));
                                else
                                    console.log(prefix + 'Body [%s] Finished', inspect(info.which));
                            });
                        });
                        msg.once('attributes', function (attrs) {
                            console.log(prefix + 'Attributes: %s', inspect(attrs, false, 8));
                        });
                        msg.once('end', function () {
                            console.log(prefix + 'Finished');
                        });
                    });
                    f.once('error', function (err) {
                        console.log('Fetch error: ' + err);
                    });
                    f.once('end', function () {
                        console.log('Done fetching all messages!');
                        imap.end();
                    });
                });
            });
            imap.once('error', function (err) {
                console.log(err);
            });
            imap.once('end', function () {
                console.log('Connection ended');
            });
            //console.log('Count', userMs.email);
        });
    });
}

main();