const express = require('express');
const router = express.Router();
const Character = require("./Character");
const path = require("path");
const multer = require("multer");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../public/uploads"));
    },
    filename: (req, file, cb) => {
        const extensao = path.extname(file.originalname).toLowerCase();
        const nomeArquivo = Date.now() + extensao;
        cb(null, nomeArquivo);
    }
});

const upload = multer({ storage: storage });


router.get("/character/index", (req,res) =>{
    Character.findAll({
        order:[
            ['id','DESC']
        ]
    }).then( characters =>{
        res.render("character/index.ejs",{
            characters: characters
        })
    })
    
})

router.get("/character/admin/new", (req,res) =>{
    res.render("character/admin/new");
})

router.post("/character/admin/save", upload.single("image"), (req,res)=>{
   var name = req.body.name;
    var nickname = req.body.nickname;
    var description = req.body.description;
    var appearance = req.body.appearance;
    var personality = req.body.personality;
    var story = req.body.story;
    var gols = req.body.goals;
    var state = req.body.state;
    var state_on_story = req.body.stateStory;
    var image = null;
    
    if(req.file){
        image = "/uploads/" + req.file.filename;
    }

    console.log(name, nickname, description, appearance, personality, story, gols, state, state_on_story);
    if(name ){
        Character.create({
            name: name,
            nickname: nickname,
            description: description,
            appearance: appearance,
            personality: personality,
            story: story,
            gols: gols,
            state: state,
            state_on_story: state_on_story,
            image: image
           
        }).then(()=>{
            res.redirect("/character/index");
        }).catch((error)=>{
            res.redirect("/character/admin/new");
        })
    }else{
        res.redirect("/character/admin/new");
    }

})


router.post("/character/delete", (req,res) =>{
    var id = req.body.id;

    Character.findByPk(id).then(characters =>{
        if(!characters){
            return null //res.redirect("/character/index");
        }else{
            return characters.setCapitulos([]).then(()=>{
                return characters.destroy()
            })
        }
    }).then(() =>{
        res.redirect("/character/index")
    }).catch(error =>{
        console.log(error);
        res.status(500).send("error to delet chapter")
    })
        
    
})

router.get("/character/read/:id",(req,res) =>{
    var id = req.params.id;
    if(id){
        Character.findByPk(id).then(characters =>{
            res.render("character/read",{
                characters: characters
            })
        }).catch((error)=>{
            console.log("error to find the character");
            res.redirect("/character/index")
        })
    }else{
        res.redirect("/character/index")
    }

})

router.get("/character/admin/update/:id",(req,res) =>{
    var id = req.params.id;

    if(isNaN(Number(id))){
        return res.redirect("/character/index")
    }

    Character.findByPk(id).then(characters =>{
        if(characters){
            res.render("character/admin/update",{
                characters: characters
            })
        }else{
            res.redirect("character/index")
        }
    }).catch(error =>{
        console.log("error to send to update page", error);
    })
    
})

router.post("/character/save",(req,res) =>{
    var name = req.body.name;
    var nickname = req.body.nickname;
    var description = req.body.description;
    var appearance = req.body.appearance;
    var personality = req.body.personality;
    var story = req.body.story;
    var gols = req.body.goals;
    var state = req.body.state;
    var state_on_story = req.body.stateStory;
    var id = req.body.id;

    if(name){
        Character.update({
            name: name,
            nickname: nickname,
            description: description,
            appearance: appearance,
            personality: personality,
            story: story,
            gols: gols,
            state: state,
            state_on_story: state_on_story
        },{

            where:{
                id:id
            }
        }).then( () =>{
            res.redirect(`/character/read/${id}`)
        }).catch(error =>{
            res.redirect("/character/index")
        })
    } else{
        res.redirect("/character/index")
    }



})
module.exports = router;