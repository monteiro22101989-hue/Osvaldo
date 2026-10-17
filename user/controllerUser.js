const express = require("express");
const router = express.Router();
const User = require("./User");
const bcrypt = require("bcryptjs");

router.get("/user/admin/new", (req, res) =>{
    res.render("user/admin/new")
})

router.post("/user/admin/save",(req,res) =>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body)

    if(name && email && password){
        User.create({
            name:name,
            email:email,
            password: password
        }).then(() =>{
            console.log("Usuário criado com sucesso:");
            res.redirect("/user/admin/new");
        }).catch((error) =>{
            console.log(error);
            res.status(500).send("Erro to create login")
        })
    }else{ 
        res.redirect("/user/admin/new")
    }

})
module.exports = router;