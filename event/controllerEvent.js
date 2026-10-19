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
    res.render("event/admin/new",{
        message: null,
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

    console.log(req.body)

    if(title && description && time){
        Event.create({
            title: title,
            description: description,
            chronologicalOrder: time,
            importance: importance,
            local: local,
            observation: observation
        }).then(events =>{
            res.render("event/admin/new",{
                message: "Form submitted successfully",
                messageType: "success"
            })
            
        }).catch((error) =>{
            console.log("Error for send the form")
        })
    }else{
        res.render("event/admin/new",{
            message:"error to subimmit",
            messageType:"danger"
        });
    }
})

module.exports = router;