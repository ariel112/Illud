//servidor web de nodeJS para publicar archivos estaticos
var express = require("express");
var app= express();

/*base de datos mysql*/
var mysql = require('mysql');

app.use(express.static("public"));
var credenciales = {
    user: "root",
    password:"",
    database:"illud_db",
    host:"localhost",
    port:"3306"
};


//exponer una carpeta como publica, unicamente para archivos estaticos: html, img, css
app.use(express.static("public"));

//verifica que si hay algun puerto libre en la pc y si no utiliza el puerto 3000
app.set('port', process.env.PORT || 3000)


// middleware




//route 







//crear y levantar el servidor web
app.listen(app.get('port'));

console.log("servidor iniciado");