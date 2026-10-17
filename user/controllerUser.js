const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./User")

router.get("/user/admin/new", (req, res) =>{
    res.render("user/admin/new",{
        message: null,
        messageType: "success"
    });

})

router.post("/user/admin/save",(req,res) =>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    console.log(req.body)

    User.findOne({
        where: {
            email:email
        }
    }).then( user =>{
        if(user){
            console.log("User is already in the sistem")
            res.render("user/admin/new",{
            message: "user already exist",
            messageType: "danger"
            })
        } else{

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            if(name && email && password){
                    User.create({
                    name:name,
                    email:email,
                    password: hash
                }).then(() =>{
                    console.log("Usuário criado com sucesso:");
                    res.render("user/admin/new",{
                        message: "User created",
                        messageType: "success"
                    });
                }).catch((error) =>{
                    console.log(error);
                    res.status(500).send("Erro to create login")
                })
            }else{ 
                res.redirect("/user/admin/new")
            }
        }
    }) 
})
       
    
module.exports = router;