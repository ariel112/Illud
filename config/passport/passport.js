// importo el modelo de facebook

//Models
var models = require("../../models");
var FacebookStrategy = require('../../node_modules/passport-facebook').Strategy;

var config = require('../config');


  //load bcrypt
  var bCrypt = require('bcrypt-nodejs');

  module.exports = function(passport,user){

  var User = user;
  var LocalStrategy = require('passport-local').Strategy;


  passport.serializeUser(function(user, done) {
          done(null, user.id);
      });


  // used to deserialize the user
  passport.deserializeUser(function(id, done) {
      User.findById(id).then(function(user) {
        if(user){
          done(null, user.get());
        }
        else{
          done(user.errors,null);
        }
      });

  });
















  passport.use('local-signup', new LocalStrategy(

    {           
      usernameField : 'email',
      passwordField : 'password',
      passReqToCallback : true // allows us to pass back the entire request to the callback
    },

    function(req, email, password, done){
       

      var generateHash = function(password) {
      return bCrypt.hashSync(password, bCrypt.genSaltSync(8), null);
      };

       User.findOne({where: {email:email}}).then(function(user){

      if(user)
      {
        return done(null, false, {message : 'That email is already taken'} );
      }

      else
      {
        var userPassword = generateHash(password);
        var data =
        { 
        email:email,
        password:userPassword,
        firstname: req.body.firstname,
        lastname: req.body.lastname
        };


        User.create(data).then(function(newUser,created){
          if(!newUser){
            return done(null,false);
          }

          if(newUser){
            return done(null,newUser);
            
          }


        });
      }


    }); 



  }



  ));
    
  //LOCAL SIGNIN
  passport.use('local-signin', new LocalStrategy(
    
  {

  // by default, local strategy uses username and password, we will override with email
  usernameField : 'email',
  passwordField : 'password',
  passReqToCallback : true // allows us to pass back the entire request to the callback
  },

  function(req, email, password, done) {


    var isValidPassword = function(userpass,password){
      return bCrypt.compareSync(password, userpass);
    }

    User.findOne({ where : { email: email}}).then(function (user) {

      if (!user) {
        return done(null, false, { message: 'Correo electronico no existe' });
      }

      if (!isValidPassword(user.password,password)) {

        return done(null, false, { message: 'Contrasena incorrecta.' });

      }

      var userinfo = user.get();

      return done(null,userinfo);

    }).catch(function(err){

      console.log("Error:",err);

      return done(null, false, { message: 'Something went wrong with your Signin' });


    });

  }
  ));


// Configuración del autenticado con Facebook
  passport.use(new FacebookStrategy({
    clientID      : config.facebook.id,
    clientSecret  : config.facebook.secret,
    callbackURL  : '/auth/facebook/callback',
    profileFields : ['id', 'displayName', /*'provider',*/ 'photos']
  }, function(accessToken, refreshToken, profile, done) {
    // El campo 'profileFields' nos permite que los campos que almacenamos
    // se llamen igual tanto para si el usuario se autentica por Twitter o
    // por Facebook, ya que cada proveedor entrega los datos en el JSON con
    // un nombre diferente.
    // Passport esto lo sabe y nos lo pone más sencillo con ese campo
    User.findOne({provider_id: profile.id}, function(err, user) {
      if(err) throw(err);
      if(!err && user!= null) return done(null, user);
   console.log(profile.id);
      // Al igual que antes, si el usuario ya existe lo devuelve
      // y si no, lo crea y salva en la base de datos
      var user = new User({
        provider_id : profile.id,
        provider     : profile.provider,
        name         : profile.displayName,
        photo       : profile.photos[0].value
      });




      user.create(function(err) {
        if(err) throw err;
        done(null, user);
      });
    });
  }));









  }





