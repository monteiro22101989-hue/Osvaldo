const express = require("express");
const router = express.Router();
const Event = require("./Event");
const { Op } = require("sequelize");
const adminauth = require("../middlewares/adminAuth")

router.get("/event/index",adminauth, (req,res) =>{
    var search = req.query.search; // por conta do filtro
    var condition = {}; // 

    if(search){
        condition ={
            [Op.or]:[
                {
                    title:{
                        [Op.like]:`%${search}%`
                    }
                },
                {
                    description:{
                        [Op.like]:`%${search}%`
                    }
                },
                {
                    chronologicalOrder:{
                        [Op.like]:`%${search}%`
                    }
                }
            ]
        }
    }
    Event.findAll({
        where: condition, // isso aqui e por conta do filtro da pagina
        order: [
            ['id','DESC']
        ],
        limit: 10
    }).then(events =>{
        res.render("event/index",{
            events: events,
            search: search
        })
    }).catch(error =>{
        console.log(error);
        res.status(500).send("error to send the informations to the index")
    })
    
})

router.get("/event/admin/new",adminauth, (req,res) =>{
    const success = req.query.success = "1";

    res.render("event/admin/new",{
        message: success ? "form subbimeted successfully" : null,
        messageType: "success"
    })
})

router.post("/event/admin/save",adminauth,(req,res) =>{
    var title = req.body.title;
    var description = req.body.description
    var time = req.body.time;
    var importance = req.body.importance;
    var local = req.body.local;
    var observation = req.body.observation;

     console.log("get all them:", req.body)

    if(title && description && time){
        Event.create({
            title: title,
            description: description,
            chronologicalOrder: time,
            importance: importance,
            local: local,
            observation: observation
        }).then(events =>{
            res.redirect("/event/admin/new?success=1"); // ele vai retornar o 1 no successo, la na rota new ele compara
            
        }).catch((error) =>{
            console.log("Error for send the form", error)
        })
    }else{
        res.render("event/admin/new",{
            message:"error to subimmit",
            messageType:"danger"
        });
    }
})

router.get("/event/read/:id",adminauth,(req,res)=>{
    var id = req.params.id;
    if(id){
        Event.findByPk(id)
        .then(events =>{
            res.render("event/read",{
                events:events
            })
        }).catch(error =>{
            console.log("error", error)
        })    
    }   
})

router.get("/event/admin/edit/:id",adminauth,(req,res) =>{
    var id = req.params.id;
    console.log("number:",id)

    if(isNaN(Number(id))){
        return res.redirect("/event/index");
    }

    Event.findByPk(id).then(event =>{
        if(event){
            res.render("event/admin/upDate",{
                event:event
            })
        }else{
            res.redirect("/event/index")
        }
    }).catch(error =>{
        console.log("Error:", error)
        res.redirect("/event/index");
    })
})

router.post("/event/save",adminauth,(req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var description = req.body.description
    var time = req.body.time;
    var importance = req.body.importance;
    var local = req.body.local;
    var observation = req.body.observation;

   

    if(title && description && time){
        Event.update({
            title: title,
            description: description,
            chronologicalOrder: time,
            importance: importance,
            local: local,
            observation: observation
        },{
            where:{
                id:id
            }
        }).then(()=>{
            res.redirect(`/event/read/${id}`)
        }).catch(error =>{
            console.log("error for update", error)
        })
    } else{
        res.redirect("/event/index")
    }
})

router.post("/event/admin/delete",adminauth,(req,res) =>{
    var id = req.params.id;
    
    if(isNaN(Number(id))){
        res.redirect("/event/index")
    }

    Event.findByPk(id).then(events =>{
        if(events){
            events.destroy();
        }else{
            return null
        }
    }).then(()=>{
        res.redirect("/event/index")
    }).catch(error =>{
        console.log("error for delete", error);
        res.redirect("/event/index")
    })
})

router.get("/event/page/:num",adminauth,(req,res) =>{
    var page = req.params.num;
    var offset = 0;
    var amount = 10;

    if(isNaN(page) || page == 1){
        offset = amount;
    }else{
        offset = (parseInt(page)) * amount;
    }
    Event.findAndCountAll({
        limit: amount,
        offset: offset,
        oerder:[
            ['id','DESC']
        ]
    }).then(events =>{
        var next;

        if(offset + amount >= events.count){
            next = false;
        } else{
            next = true;
        }

        var result ={
            next:next,
            events: events,
            page: parseInt(page)
        }
        res.render("event/page",{result:result, events:events.rows })

    })
})

module.exports = router;