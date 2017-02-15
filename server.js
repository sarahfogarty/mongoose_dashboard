var express = require('express');
var bodyParser = require('body-parser');
var mongoose =require('mongoose');
var path = require('path');

//Create Express app
var app = express();

//use boyParser to parse for data sent cia HTTP POST
app.use(bodyParser.urlencoded({extended: true}));

//Tell server where views are adn what templating engind I'm using
app.set('views', path.join(__dirname, './views'));
app.set('view engine', 'ejs');

//Create connection to database
var connections = mongoose.connect('mongodb://localhost/mongoose_dashboard');
//
// //Create Schema and attach as a model to our database
var AnimalSchema = new mongoose.Schema({
 name: {type: String},
 updated_at: Date
});
//
// //validations
// // AnimalSchema.path('name').required(true, 'Name field cannot be blank\n');
//
// mongoose.model('Animal', AnimalSchema);
var Animal = mongoose.model('Animal', AnimalSchema);
// // mongoose.Promise = global.Promise;
//
// //Index - Show all animals in database
app.get('/', function(req, res){
  Animal.find({}, function(err, animals){
    if(err){
      console.log('Error!');
    }else{
      console.log('found it!');
      res.render('index', {animals: animals});
    }
  });
});
//
// // Create new Animal - POST method
app.post('/', function(req, res) {
    Animal.create(req.body, function(err, result) {
        if (err) {console.log(err);}
        res.redirect('/');
    });
});
//
// //New
app.get('/new', function(req, res) {
    res.render('new');
});
//
// //Show
app.get('/specific/:id', function(req, res){
    Animal.find({ _id: req.params.id}, function (err, response) {
        if (err) {
            console.log(err);
        }
    res.render('specific', {animal: response[0]});
    });
});
//
// //edit
app.get('/:id/edit', function (req, res) {
    Animal.find({ _id: req.params.id }, function(err, response){
        if (err) {console.log(err);}
        res.render('edit', {animal: response[0]});
    });
});


//update
app.post('/:id', function (req, res) {
    Animal.update({_id: req.params.id}, req.body, function(err, animal){
        if (err) {console.log(err);}
        res.redirect('/');
    });
});

//delete
app.post('/:id/delete', function(req, res){
    Animal.remove({ _id: req.params.id}, function(err, results){
        if (err) {console.log(err); }
        res.redirect('/');
    });
});

app.listen(8000, function(){
  console.log("listening on port 8000");
});
