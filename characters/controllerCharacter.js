const express = require('express');
const router = express.Router();
const Character = require("./Character");

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

router.post("/character/admin/save", (req,res)=>{
   var name = req.body.name;
    var nickname = req.body.nickname;
    var description = req.body.description;
    var appearance = req.body.appearance;
    var personality = req.body.personality;
    var story = req.body.story;
    var gols = req.body.goals;
    var state = req.body.state;
    var state_on_story = req.body.stateStory;
    

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
            state_on_story: state_on_story
           
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
            return res.redirect("/character/index");
        }else{
            return characters.setCapitulos([]).then(()=>{
                return characters.destroy()
            })
        }
    }).then(() =>{
        res.redirect("/character/index")
    }).catch(erros =>{
        console.log(erros);
        res.status(500).send("error to delet chapter")
    })
        
    
})


module.exports = router;