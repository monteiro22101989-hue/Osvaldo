const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("./User");
const crypto = require("crypto"); 

router.get("/user/login",(req,res) =>{
    res.locals.paginaPublica = true;
    res.render("user/login",{
        message: null,
        messageType:"success"
        
    })
})


router.get("/user/admin/new", (req, res) =>{
    res.locals.paginaPublica = true;
    res.render("user/admin/new",{
        message: null,
        messageType: "success",
        
    });

})

router.post("/user/admin/save",(req,res) =>{
    var name = req.body.name;
    var email = req.body.email;
    var password = req.body.password;
    var confirmPassword = req.body.confirmPassword;
    res.locals.paginaPublica = true;

    if(password !== confirmPassword){
        return res.render("user/admin/new",{
            message: "senhas divergentes",
            messageType: "danger",
        })
    }

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
            messageType: "danger",
            })
        } else{

            var salt = bcrypt.genSaltSync(10);
            var hash = bcrypt.hashSync(password, salt)

            if(name && email && password && confirmPassword){
                    User.create({
                    name:name,
                    email:email,
                    password: hash
                }).then(() =>{
                    console.log("Usuário criado com sucesso:");
                    res.render("index",{
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


router.post("/authenticate",(req,res) =>{
    console.log("rota authenticate foi chamada")

    var email = req.body.email;
    var pass = req.body.password;

    
    User.findOne({
        where:{
            email:email
        }
    }).then(user =>{
        var correct = bcrypt.compareSync(pass, user.password);

        console.log("Resultado da comparação:", correct);

        if(email && pass){
            if(!user){
                return res.render("user/login",{
                    message: "Usuario nao encontrado",
                    messageType:"danger"
                })                    }
                    // compara com o hash salvo
            var correct = bcrypt.compareSync(pass, user.password);

            if(correct){
                req.session.user={
                    id: user.id,
                    email: user.email
                }
                res.redirect("/index")
            }else{
                res.render("user/login",{
                    message: "Senha incorreta",
                    messageType:"danger"
                })
            }
                
        }else{
            res.render("user/login",{
                message:"preencha todos os campos",
                messageType:"danger"
            })
        }

    })
    
})

router.get("/logout",(req,res)=>{
    req.session.destroy(()=>{
        res.redirect("/user/login")
    })
    
})


// Recuperando Senha
router.get("/user/admin/recover",(req,res)=>{
    res.render("user/admin/recover",{
        message: null,
        messageType:"success"
    })
})
   


router.post("/user/admin/recoverEmail", (req,res) =>{
    var email = req.body.email;
    console.log("chegou aqui", req.body.email)

    if(!email){
        res.redirect("/user/login")
    }
    User.findOne({
        where:{
            email:email
        }
    }).then(user =>{
        if(!user){
            return res.render("user/admin/recover",{
                message: "email nao encontrado",
                messageType: "danger"
            });
        }
        res.render("user/login",{
            message: "Voce recebera um email de recuperacao de senha",
            messageType: "success"
            
        })
    })
})
module.exports = router;