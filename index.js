//servidor web de nodeJS para publicar archivos estaticos
var express = require("express");
var app= express();
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load();
var exphbs     = require('express-handlebars')

//para el bodyParser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());


//para el passport 
app.use(session({ secret: 'keyboard cat',resave: true, saveUninitialized:true})); // session secret 
app.use(passport.initialize()); 
app.use(passport.session()); // persistent login sessions



 //para Handlebars
    app.set('views', './app/views')
    app.engine('hbs', exphbs({extname: '.hbs'}));
    app.set('view engine', '.hbs');
    


//Models
var models = require("./models");

//Routes
var authRoute = require('./app/routes/auth.js')(app,passport);
 
//load passport strategies
require('./config/passport/passport.js')(passport,models.tbl_usuario);


//Sync Database
models.sequelize.sync().then(function() {
 
    console.log('Conexion con la base de datos exitosa')
 
}).catch(function(err) {
 
    console.log(err, "Algo salió mal con la actualización de la base de datos!")
 
});

/*
var mysql = require('mysql');

app.use(express.static("public"));
var credenciales = {
    user: "root",
    password:"",
    database:"illud_db",
    host:"localhost",
    port:"3306"
};
*/

//exponer una carpeta como publica, unicamente para archivos estaticos: html, img, css
app.use(express.static("public"));

//verifica que si hay algun puerto libre en la pc y si no utiliza el puerto 3000
app.set('port', process.env.PORT || 3000)


// middleware




//route 







//crear y levantar el servidor web
app.listen(app.get('port'));

console.log("servidor iniciado");