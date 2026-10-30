function adminAuth(req, res, next){
    if(req.session.user != undefined){
        res.locals.paginaPublica = false;
        next();
    }else{
        res.redirect("/user/login");
    }
}

module.exports = adminAuth;