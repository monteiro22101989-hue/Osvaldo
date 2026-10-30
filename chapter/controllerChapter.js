const express = require("express");
const router = express.Router();
const Chapter = require("./Chapter");
const Character = require("../characters/Character")
const { Op } = require("sequelize");
const adminauth = require("../middlewares/adminAuth");

//index
router.get("/chapter/index", adminauth,(req,res) =>{
    var search = req.query.search;
    var condition = {};

    if(search){
        condition ={
            [Op.or]:[
                {
                    title: {
                        [Op.like]: `%${search}%`
                    }
                },
                {
                    order: search
                }
               
            ]
            
        }
    }

    Chapter.findAll({
        where: condition,
        include: [{
            model: Character,
            required: false
        }],
        order: [
            ['order', 'ASC']
        ],
        limit: 5
    }).then(chapters => {

        res.render("chapter/index", {
            chapters: chapters,
            search: search
        });

    }).catch(error => {
        console.error("Erro na pesquisa de capítulos:", error);
        res.status(500).send("Erro ao buscar capitulos");
    });

})


router.get("/chapter/admin/new", adminauth,(req, res) => {
    
    Character.findAll().then(characters => {
        Chapter.findOne({
            order: [["order", "DESC"]]
        }).then(lastChapter => {
            res.render("chapter/admin/new", {
                message: null,
                messageType:"success",
                characters: characters,
                lastChapter: lastChapter
            });
        });
    });
});




router.post("/chapter/admin/save",adminauth,(req,res) =>{
    var title = req.body.title;
    var content = req.body.content;
    var order = req.body.ordem;
    var characters = req.body["characters[]"];

    console.log("Personagens selecionados:", characters);

    if(title && content && order){

        Chapter.findOne({
            where: {
                order: order
            }
        }).then(chapter =>{
            if(chapter){
                return Character.findAll().then(characters =>{
                return Chapter.findOne({
                    order: [["order", "DESC"]]
                }).then(lastChapter =>{
                    return res.render("chapter/admin/new",{
                        characters: characters,
                        lastChapter: lastChapter,
                        message: "numero de capitulo ja existente",
                        messageType: "danger"
                    })
                })
            })
            }else{
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
                .then(() =>{
                    res.redirect("/chapter/index");
                })
                .catch((error) =>{
                    console.log(error);
                    res.redirect("/chapter/index");
                })
            }
        })

    }else{
        res.redirect("/chapter/admin/new")
    }
})
router.get("/chapter/admin/upDate/:id",adminauth,(req,res) =>{
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

router.post("/chapter/save", adminauth,(req,res) =>{
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

router.get("/chapter/read/:id",adminauth,(req,res) =>{
    var id = req.params.id;
    Chapter.findByPk(id, {
        include: [{
            model:Character
        }]
    })
    .then(chapters =>{
        if(!chapters){
            res.redirect("/chapter/index")
        }
        res.render("chapter/read",{
            chapters: chapters
        })
    }).catch((error)=>{
        console.log("error",error);
        res.redirect("/chapter/index")
    })
})

router.get("/chapter/page/:num",adminauth,(req,res) =>{
    var page = req.params.num;
    var offset = 0;
    var amount = 5;

    if(isNaN(page) || page == 1){
        offset = amount;
    }else{
        offset = (parseInt(page)) * amount;
    }

    Chapter.findAndCountAll({
        limit: amount,
        offset: offset,
        include: [{
            model: Character,
            required: false
        }],
        distinct: true,
        order: [
            ['id', 'DESC']
        ]
    }).then(chapters => {
        var next;

        if (offset + amount >= chapters.count) {
            next = false;
        } else {
            next = true;
        }

        var result = {
            next: next,
            chapters: chapters,
            page: parseInt(page)
        };

        res.render("chapter/page", {
            result: result,
            chapters: chapters.rows
        });
    });



})


module.exports = router;