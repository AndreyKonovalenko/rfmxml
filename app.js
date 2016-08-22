var express =   require("express");
var multer  =   require('multer');
var querystring = require("querystring");
var app  =   express();
var util = require('util');

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {
    callback(null, file.fieldname + '-' + Date.now() + ".xml");
  }
});
var upload = multer({ storage : storage}).single('file_location');


app.use(express.static(__dirname + '/css')); //serve css static

app.get('/',function(req,res){
  res.sendFile(__dirname + "/index.html"); // first page with file forms uploader
});


//   1. Post request to uload xml file to server
  // 1.1 How to read file name from form and save it as a parameter for main logic module
  // Check for file existance:
    // If in uploads folder exist any file - delet it
      //else continue to uploadeing
app.post('/uploaded',function(req,res){ 
    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("File is uploaded");
    });
});

// Manual redirecting to upload route with data form

app.get('/uploaded',function(req,res){
  res.sendFile(__dirname + "/uploaded.html");;
});


// Post request to send data to server
  // Need to decide where to store  data from form
      // My be create a temp file(how to do it)
  // how to transfer data to main logic module 
app.post('/uploaded/data', function(req,res){
  req.on("data", function(postBody){
    var query = querystring.parse(postBody.toString());
    console.log(query.username);
    res.end();
    });
});

//Manual starting main logic moduale by manual redirecting to start rout
  // riquire main logit module for xml parsing 
  // main logic module need to be improved
    // taking data form data form
    // multipal file creation 
app.get('/start',function(req,res){
      console.log("stat the program!");
});

//Manual dwonloading new files by manual redirection to download roud
  //Impoving downlode process:
    //Check dowloads dir for file quantity
    //Find way dinamicle pass files names to  res.download
app.get('/download',function(req,res){
  var filename = "";
  var pathtofile = __dirname  + "/dowloads "+ filename;
  res.download(pathtofile);
});


app.listen(3000,function(){
    console.log("Working on port 3000");
});

// Global problems:
  // Don't know how to redirect routs automaticly
  // Wuold be nice to solve the promlem with separate parsing forms with file and data 
  // improvein UX with solving manual redirection promblem, for ex: create buttons


// My todo list 111
// For example:  
  // we can change the routs:
    //fist serve the form with data and from this form take the file name as a parameter
    // and send it uplod module
    // than sereve form with only one field wit file and upload it  - good decision

    // By implomenting this dexcision we solve 1.1 par