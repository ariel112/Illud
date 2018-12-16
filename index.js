//servidor web de nodeJS para publicar archivos estaticos
var express = require("express");
var app= express();
var passport   = require('passport')
var session    = require('express-session')
var bodyParser = require('body-parser')
var env = require('dotenv').load();
var exphbs     = require('express-handlebars')


/*esta la voy a utilizar para hacer las api resfull*/
var mysql = require("mysql");

var session      = require('express-session');
var MySQLStore   = require('express-mysql-session')(session);
//esta conexion la hago para utilizar el passport 
if (typeof process.env.OPENSHIFT_MYSQL_DB_HOST === undefined){
    var options = {
        host     : 'localhost',
        port     : '3306',
        user     : 'root',
        password : null,
        database : 'illud_db',
        socketpath: '/var/run/mysqld/mysqld.sock'
    }
} else { 
    var options = {
        host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
        port     : process.env.OPENSHIFT_MYSQL_DB_PORT,
        user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
        password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
        database : process.env.OPENSHIFT_APP_NAME,
        socket   : process.env.OPENSHIFT_MYSQL_DB_SOCKET
    }
};    

var credenciales = {
    host:"localhost",
    user:"root",
    password:"",
    port:"3306",
    database: "illud_db"
};









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



//exponer una carpeta como publica, unicamente para archivos estaticos: html, img, css
app.use(express.static("public"));

//verifica que si hay algun puerto libre en la pc y si no utiliza el puerto 3000
app.set('port', process.env.PORT || 3000)


// middleware




//route 


//obtener las carpetas del usuario
app.get('/carpetas/:id', function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(`
        SELECT *
            FROM tbl_carpeta 
            WHERE tbl_usuarios_id = ? `,
            [
              req.params.id
            ], function(error,data,fields){
                res.send(data);
                res.end();
            }
        );


} );



// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook'));


// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/dashboard', failureRedirect: '/index' }
));




//











//crear y levantar el servidor web
app.listen(app.get('port'));

console.log("servidor iniciado");