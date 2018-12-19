var exports = module.exports = {}
 
exports.signup = function(req, res) {
 
    res.render('registrarse');
 
}

exports.signin = function(req, res) {
 
    res.render('index');
 
}

exports.dashboard = function(req, res) {
    

    res.render('dashboard',req);
 
}

exports.index = function(req, res) {
 
    res.render('index');
 
}

exports.pen = function(req, res, next) {
    console.log(req.params.id);
    res.render('pen',{id:req.params.id});
 
}


exports.logout = function(req, res) {
 
    req.session.destroy(function(err) {
 
        res.redirect('index');
 
    });


 
}