var express =   require("express");
var multer  =   require('multer');
var querystring = require("querystring");
var fs = require("fs");
var main_logic = require("./xmlreader.js");
var app  =   express();
var util = require('util');

var xml2js = require('xml2js');


var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, data_object.file_name);
  }
});


var data_object = {};
//post into single method file name from form
var upload = multer({ storage : storage}).single('file_name'); 

// in future put this try catch to main logic module instead 1.txt should put file_name programatecly/
// or create logic for deleting all files in directory
try { 
  fs.unlinkSync(__dirname + '/uploads/1.txt');
} catch (err) {
  console.error(err);
}


app.use(express.static(__dirname + '/css')); //serve css static

app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html"); // first page with file forms with only data here we save the name of a file
  // file name in this form is a text not file, like in the next form in uploded rout
});

// Post request to send data to server
  // Need to decide where to store  data from form
      // My be create a temp file(how to do it)
  // how to transfer data to main logic module 

app.post('/uploaded/', function(req,res){
  req.on("data", function(postBody){
    var query = querystring.parse(postBody.toString());
    data_object.message_quantity = query.message_quantity;
    data_object.file_name = query.file_name;
    data_object.number_of_first_сontract = query.number_of_first_сontract;
    data_object.last_number = query.last_number;
    // test data transferr to data_object from form
    console.log(data_object.message_quantity,
                data_object.file_name, 
                data_object.number_of_first_сontract, 
                data_object.last_number); 
    res.end();
    });
});

// Manual redirecting to upload route with xml to upload form

app.get('/uploaded',function(req,res){
  //res.send("<h1>Answer is" + data_object.message_quantity + "!</h1>"); test
  res.sendFile(__dirname + "/uploaded.html");
});

//   1. Post request to uload xml file to server
  // 1.1 How to read file name from form and save it as a parameter for main logic module
  // Check for file existance:
    // If in uploads folder exist any file - delet it
      //else continue to uploadeing
app.post('/uploaded/data',function(req,res){ 
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});


//Manual starting main logic moduale by manual redirecting to start rout
  // riquire main logit module for xml parsing 
  // main logic module need to be improved
    // taking data form data form
    // multipal file creation 
app.get('/start',function(req,res){
  main_logic.main_logic(data_object.file_name, data_object.message_quantity, data_object.number_of_first_сontract, data_object.last_number);
  res.end('Main logic did its work)))');
});

/*app.post('/start',function(req,res){
  res.on("data", p

    main_logic(data_object.file_name, data_object.message_quantity, data_object.number_of_first_сontract, data_object.last_number);
  console.log("stat the program!");
});*/

//Manual dwonloading new files by manual redirection to download roud
  //Impoving downlode process:
    //Check dowloads dir for file quantity
    //Find way dinamicle pass files names to  res.download
app.get('/download',function(req,res){
  res.download(__dirname  + "/downloads/archive.zip");  
});


app.listen(3000,function(){
    console.log("Working on port 3000");
});

// Global problems:
  // Don't know how to redirect routs automaticly
  // Wuold be nice to solve the promlem with separate parsing forms with file and data 
  // improvein UX with solving manual redirection promblem, for ex: create buttons


/*let file_arr = fs.readdirSync(__dirname + '/downloads');
  console.log(file_arr);
  for (let filename of file_arr) {
    var pathtofile = __dirname  + "/downloads "+ filename;
    res.download(pathtofile);
  }
  res.end('All fiels downloaded!');  
});*/