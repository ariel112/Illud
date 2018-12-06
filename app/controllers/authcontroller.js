var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('registrarse');
 
}

exports.signin = function(req, res) {
 
    res.render('index');
 
}

exports.dashboard = function(req, res) {
 
    res.render('dashboard');
 
}

exports.index = function(req, res) {
 
    res.render('index');
 
}


exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('index');
 
    });


 
}