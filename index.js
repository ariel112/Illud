//servidor web de nodeJS para publicar archivos estaticos
var express = require("express");
var app= express();

//exponer una carpeta como publica, unicamente para archivos estaticos: html, img, css
app.use(express.static("public"));

//crear y levantar el servidor web
app.listen(3000);
console.log("servidor iniciado");