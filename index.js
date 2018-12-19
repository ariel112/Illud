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

app.get('/logout', function(req, res){
  req.logout();
  res.redirect('/');
});

//obtener las carpetas del usuario
app.get('/carpetas/:id', function(req, res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(`
        SELECT *
            FROM tbl_carpeta 
            WHERE id_usuario = ? `,
            [
              req.params.id
            ], function(error,data,fields){
                res.send(data);
                res.end();
            }
        );


} );

//crear carpeta

app.post("/guardar-carpeta",function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
       `
       INSERT INTO 
            tbl_carpeta ( id_estado, nombre, descripcion, created, updated, tbl_usuarios_id) 
            VALUES 
            (?,?,?,now(),now(),?)
       `,
        [
            req.body.estado,
            req.body.nombre,
            req.body.descripcion,
            req.body.id_usuario
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );
});




/*voy a mostrar los pen: son los codigos que utilice para crear js html css*/
app.get("/cargar-pens/:id", function(req,res){
     var conexion = mysql.createConnection(credenciales);

     conexion.query(
        `
        SELECT 
        id, id_estado,
        nombre,
        string_html,
        string_css,
        string_js, 
        DATE_FORMAT(created, '%Y-%d-%m') as created,
        updated_at,
        tbl_usuarios_id
                    FROM tbl_proyectos
                   WHERE tbl_usuarios_id = ?;
       `,
       [req.params.id],
       function(error,data,fields){
        console.log(error);
        res.send(data);
        res.end();
       }
        );
});

/*lo utilizo para guardar los pens*/
app.post('/guardar-pen', function(req,res){
    var conexion = mysql.createConnection(credenciales);
     conexion.query(
       `
       INSERT INTO tbl_proyectos
        (id_estado, nombre, created, updated_at, tbl_usuarios_id) 
        VALUES (?,?,now(),now(),?)       
       `,
        [
            req.body.estado,
            req.body.nombre,           
            req.body.id_usuario
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );

});


/*guardo codigo de cada pen*/
app.put('/editar-pen/:id', function(req,res){
    var conexion = mysql.createConnection(credenciales);
     conexion.query(
       `
       UPDATE tbl_proyectos SET           
            string_html=?,
            string_css=?,
            string_js=?
            WHERE id=?       
       `,
        [   

            req.body.html,
            req.body.css,           
            req.body.js,
            req.params.id
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );

});



/*aqui seria como ver el perfil de cada pen*/
app.use('/verPen/:id',function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        `
         SELECT * FROM tbl_proyectos WHERE id = ?;
        `,
        [
          req.params.id
        ],
        function(error,data,fields){
            if(error){
                res.send(eror);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        } 
    );
});

// Ruta para autenticarse con Facebook (enlace de login)
app.get('/auth/facebook', passport.authenticate('facebook'));


// Ruta de callback, a la que redirigirá tras autenticarse con Facebook.
// En caso de fallo redirige a otra vista '/login'
app.get('/auth/facebook/callback', passport.authenticate('facebook',
  { successRedirect: '/dashboard', failureRedirect: '/index' }
));




//voy a ver la ruta para compartir proyectos

app.use('/compartido/:id', function(req,res){
var conexion = mysql.createConnection(credenciales);
conexion.query(
    `
    SELECT B.proyectos_id, C.id, C.id_estado, C.nombre
            FROM tbl_usuarios A
            INNER JOIN compartido B
            ON(A.id=B.id_compartido)
            INNER JOIN tbl_proyectos C
            ON(C.id=B.proyectos_id)
            WHERE A.id= ? OR B.id_comparte= ?;
     `,
     [
       req.params.id,
       req.params.id
     ],
     function(error,data,fields){
         if(error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );

});


/*voy a listar todos los usuarios*/
app.get('/listar_usuarios',function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        `
        SELECT *
           FROM tbl_usuarios;
        `,[],
        function(error,data,fields){
            if(error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
        );

});

/*COMPARTIR PEN*/
app.post('/guardar-comparte', function(req,res){
    var conexion = mysql.createConnection(credenciales);
     conexion.query(
       `
      INSERT INTO compartido
        ( id_comparte, id_compartido, proyectos_id) 
        VALUES (?,?,?)       
       `,
        [
            req.body.comparte,
            req.body.compartido,           
            req.body.proyecto_id
        ],
        function(error, data, fields){
            if (error){
                res.send(error);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
    );

});

/*cargar proyectos en el baner principal*/

app.get('/proyectos_home', function(req,res){
    var conexion = mysql.createConnection(credenciales);
    conexion.query(
        `
        SELECT B.email, A.nombre as nombre, A.created, A.id
            FROM tbl_proyectos A
            INNER JOIN tbl_usuarios B
            ON(A.tbl_usuarios_id=B.id)
            WHERE A.id_estado=1;
        `,
        [ ],
        function(error,data,fields){
            if(error){
                res.send(data);
                res.end();
            }else{
                res.send(data);
                res.end();
            }
        }
        );
});





//crear y levantar el servidor web
app.listen(app.get('port'));

console.log("servidor iniciado");