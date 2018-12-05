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

//crear y levantar el servidor web
app.listen(3000);
console.log("servidor iniciado");