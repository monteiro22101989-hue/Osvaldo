const express = require("express");
const router = express.Router();
const Event = require("./Event");

router.get("/event/index", (req,res) =>{
    
    Event.findAll({
        order: [
            ['id','DESC']
        ]
    }).then(events =>{
        res.render("event/index",{
            events: events
        })
    }).catch(error =>{
        console.log(error);
        res.status(500).send("error to send the informations to the index")
    })
    
})

router.get("/event/admin/new",(req,res) =>{
    const success = req.query.success = "1";

    res.render("event/admin/new",{
        message: success ? "form subbimeted successfully" : null,
        messageType: "success"
    })
})

router.post("/event/admin/save",(req,res) =>{
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

router.get("/event/read/:id",(req,res)=>{
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

router.get("/event/admin/edit/:id",(req,res) =>{
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

router.post("/event/save",(req,res)=>{
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

router.post("/event/admin/delete",(req,res) =>{
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

module.exports = router;