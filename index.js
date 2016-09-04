"use strict";

var express = require("express");
var multer  = require('multer');
var querystring = require("querystring");
var fs = require("fs");
var main_logic = require(__dirname + "/xmlreader.js");
var app  =   express();
var util = require('util');
var xml2js = require('xml2js');

app.set('port', (process.env.PORT || 5000));

var storage =  multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, __dirname + '/uploads');
  },
  filename: function (req, file, callback) {
    callback(null, data_object.file_name);
  }
});

var data_object = {};

var upload = multer({ storage : storage}).single('file_name');

app.use(express.static(__dirname + '/css')); //serve css static
app.use(express.static(__dirname + '/uploads'));
app.use(express.static(__dirname + '/downloads'));
app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html");
  try { 
    file_deleter('/downloads/');
    }
  catch (err) {
    console.error(err);
  }

  try { 
    file_deleter('/uploads/');
  }
  catch (err) {
    console.error(err);
  }
});

app.post('/uploaded/', function(req,res){
  req.on("data", function(postBody){
    var query = querystring.parse(postBody.toString());
    data_object.message_quantity = query.message_quantity;
    data_object.file_name = query.file_name;
    data_object.number_of_first_сontract = query.number_of_first_сontract;
    data_object.last_number = query.last_number;
    res.end();
    });
});

app.get('/uploaded',function(req,res){
  res.sendFile(__dirname + "/uploaded.html");
});

app.post('/uploaded/data',function(req,res){ 
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

app.get('/start',function(req,res){
  main_logic.main_logic(data_object.file_name, data_object.message_quantity, data_object.number_of_first_сontract, data_object.last_number);
  res.end('Main logic did its work)))');
});

app.get('/download',function(req,res){
  res.download(__dirname  + "/downloads/archive.zip");  
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});


function file_deleter(filepath){
  var file_arr = fs.readdirSync(__dirname + filepath);
  for (var i = 0; i < file_arr.length; i++) {
  var filename = file_arr[i];
  fs.unlinkSync(__dirname + filepath + filename);
  }
}