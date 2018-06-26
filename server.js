//express server
//server open and environmet value
const express = require('express');
const app = express();
const port_express = 10080;
//let express can use .body. to get data for method'post'
var bodyParser = require('body-parser');
app.use(bodyParser({limit: '50mb'}));
app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ // to support URL-encoded bodies
    extended: true
}));
//use data at '/public'
app.use(express.static(__dirname));
//listen port
app.listen(port_express, function () {
    console.log('Example app listening on port ' + port_express + ' !');
});

//MongoDB
//URL, may change due to different server

const db_url = 'mongodb://uidd2018_groupH:71222217@luffy.ee.ncku.edu.tw/uidd2018_groupH';
const db_name = 'uidd2018_groupH';
const db_col = 'Messages';
//import mongodb
var MongoClient = require('mongodb').MongoClient;
//Test DB connection
MongoClient.connect(db_url, function (err, client) {
    if (err) throw err;
    console.log('mongodb is running!');
    client.close();
});

//accept 'post' from /ajax_data (input forum) and send back to front page
//save message function have not done
app.post("/sendHeadImage", function (req, res) {
    console.log('receive data: \n  ' + req.body.headImage.substr(0, 100) + "  ...");
    MongoClient.connect(db_url, function (err, client) {
        const db = client.db(db_name);
        const col = db.collection(db_col);
        if (err) throw err;
        col.insertOne({
            headImage: req.body.headImage,
        });
        client.close();
    });
});