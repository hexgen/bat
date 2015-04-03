var inbox = require("inbox"),
    util = require("util");

var mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.10.170:27017/wepo_company_acl');

var db = require('monk')('mongodb://192.168.10.170:27017/wepo_company_acl');
var Mail = db.get('MailDetail');


//var MailParser = require("mailparser").MailParser,
//    mailparser = new MailParser();
var MailParser = require("mailparser").MailParser;

//mailparser.on("end", function(mail_object){
//    console.log("//////////////////////////////Parsed Object Start//////////////////////////// \n");
//    console.log("From:", mail_object.from);
//    console.log("Subject:", mail_object.subject);
//    console.log("Text body:", mail_object.text);
//    console.log("//////////////////////////////Parsed Object End////////////////////////////// \n");
//});

var client = inbox.createConnection(false, "imap.gmail.com", {
    secureConnection: true,
    auth: {
        user: "stanislav.b.com@gmail.com",
        pass: "kolsopasof"
    }
    //debug: true
});

client.connect();

client.on("connect", function () {

    client.listMailboxes(console.log);

    client.openMailbox("INBOX", function (error, mailbox) {
        if (error) throw error;

        // List newest 10 messages
        client.listMessages(0, function (err, messages) {
            messages.forEach(function (message) {
                //console.log(message.UID+": "+message.title);
                console.log('UID: ', message.UID);
                //client.createMessageStream(message.UID).pipe(process.stdout, {end: false});
                var mailparser = new MailParser();
                mailparser.on("end", function (mail_object) {

                    Mail.findOne({'header.message-id': mail_object.headers['message-id']}).on('complete', function (err, doc) {
                        if (err) return console.log(err);
                        //console.log('Document In Wepo 1111111111111111111111111111111111111111111');
                        //console.log({'header.message-id':mail_object.headers['message-id']}, doc);
                        if (doc != null) {
                            doc.text = mail_object.html;
                            Mail.updateById(doc._id, doc, function (err, doc) {
                                console.log(err, doc)
                            });
                        }
                    });


                    console.log("//////////////////////////////Parsed Object Start//////////////////////////// \n");
                    console.log("Message-id:", mail_object.headers['message-id']);
                    console.log("MailObject html:", mail_object.html);
                    console.log("Attachments:", mail_object.attachments);
                    console.log("From:", mail_object.from);
                    console.log("Subject:", mail_object.subject);
                    console.log("Text body:", mail_object.text);
                    console.log("//////////////////////////////Parsed Object End////////////////////////////// \n");
                });
                client.createMessageStream(message.UID).pipe(mailparser);
            });
            //client.close();
            //client.listFlags(-10, function(err, messages){
            //    messages.forEach(function(message){
            //        console.log(message);
            //    });
            //client.close();
            //});
        });
    });

    // on new messages, print to console
    //client.on("new", function(message){
    //    console.log("New message:");
    //    console.log(util.inspect(message, false, 7));
    //
    //    client.createMessageStream(message.UID).pipe(process.stdout, {end: false});
    //});
});

client.on('error', function (err) {
    console.log('Error');
    console.log(err)
});

client.on('close', function () {
    console.log('DISCONNECTED!');
});
