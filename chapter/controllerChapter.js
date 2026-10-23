const express = require("express");
const router = express.Router();
const Chapter = require("./Chapter");
const Character = require("../characters/Character")


//index
router.get("/chapter/index", (req,res) =>{
    Chapter.findAll({
        include: [Character],
        order: [
            ['id','DESC']
        ]   
    }).then(chapters =>{
        res.render("chapter/index",{
            chapters: chapters
        });  
    }).catch( error =>{
        console.log(error);
        res.status(500).send("Erro ao buscar capitulos")
    })
})


router.get("/chapter/admin/new",(req,res) =>{
    Character.findAll().then( characters =>{
        res.render("chapter/admin/new",{characters: characters})
    })
})




router.post("/chapter/admin/save",(req,res) =>{

   
    var title = req.body.title;
    var content = req.body.content;
    var order = req.body.ordem;
    var characters = req.body["characters[]"];

console.log("Personagens selecionados:", characters);
    if(title && content && order){
        Chapter.create({
            title: title,
            content: content,
            order: order
        })
        .then(chapter =>{
            if(characters){
                return chapter.setCharacters(characters);
            }
            
        })
        .then( () =>{
            res.redirect("/chapter/index");
           // res.json({mßessage: "Capitulo criado com sucesso!"});
            
        }).catch((error) =>{
            res.redirect("/chapter/index")
        })
    }else{
        res.redirect("/chapter/admin/new")
    }
})

router.get("/chapter/admin/upDate/:id",(req,res) =>{
    var id = req.params.id;

    
    if(isNaN(Number(id))){
       return res.redirect("/chapter/index");
    }

    Chapter.findByPk(id, {
        include: [Character] // busca os personagens ja associados ao capitulo
    }).then(chapter =>{
        console.log(chapter.Characters);
        if(chapter){
            Character.findAll().then(character =>{
                res.render("chapter/admin/update",{
                chapter: chapter,
                characters: character
                })
            })
            
        }else{
            res.redirect("/chapter/index");
        }
    }).catch(error => {
        res.redirect("/chapter/index");
    })
})

router.post("/chapter/save", (req,res) =>{
   var id = req.body.id;
   var title = req.body.title;
   var content = req.body.content;
   var order = req.body.ordem;
   var characters = req.body["characters[]"]

   console.log("Chapter dates:",id, title, content, order);
   Chapter.update({    
        title: title,
        content: content,
        order: order
   },{
        where: {
            id:id
        }
   }).then(()=>{
        return Chapter.findByPk(id);
   })
   .then(chapter =>{
        if(chapter){
            return chapter.setCharacters(characters || []);// se tiver algum caracter ou se tiver vazio []. assim ele vai tirar os personagems que nao colocarmos na edicao
            
        }
        
   }).then(() =>{
        res.redirect(`/chapter/read/${id}`);
   })
   .catch(error =>{
        res.redirect(`/chapter/read/${id}`);
   })
})

router.post("/chapter/delete", (req,res) =>{
    var id = req.body.id;

    Chapter.findByPk(id).then(chapter =>{
        if(!chapter){
            return res.redirect("/chapter/index")
        }else{
            return chapter.setCharacters([]).then(()=>{ // limpa as linhas da tabela que tem os personagens vinculados ao capitulo
                chapter.destroy()
            })
        }
    }).then(() =>{
        res.redirect("/chapter/index")
    }).catch(error =>{
        console.log(error);
        res.status(500).send("error to delet chapter")
    })
})

router.get("/chapter/read/:id",(req,res) =>{
    var id = req.params.id;
    Chapter.findByPk(id)
    .then(chapters =>{
        res.render("chapter/read",{
            chapters: chapters
        })
    }).catch((error)=>{
        console.log("error",error);
        res.redirect("/chapter/index")
    })
})



module.exports = router;