var authController = require('../controllers/authcontroller.js');
 



module.exports = function(app,passport) {
   app.get('/penpublic/:id',authController.pen);

    app.get('/signup', authController.signup);
 	app.get('/signin', authController.signin);

 	app.post('/signup', passport.authenticate(
        'local-signup',  
        { 
            successRedirect: '/dashboard',
            failureRedirect: '/signup'
        }
                                                    ));
 	
    app.get('/dashboard',isLoggedIn, authController.dashboard);
 	app.get('/logout',authController.logout);

    /*ruta para el index*/
    app.get('/index',authController.index);      
   
     /*Ruta para controlar el pen*/    
     app.get('/pen/:id',isLoggedIn,authController.pen);
     
     app.get('/edit/:id',isLoggedIn,authController.edit); 

    app.post('/signin', passport.authenticate('local-signin', 
    { 
        successRedirect: '/dashboard',
        failureRedirect: '/signin'
    }
                                                    ));

   


    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated())
            return next();

        res.redirect('/signin');
    }





}