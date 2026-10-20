const express = require("express");
const router = express.Router();
const Summary = require("./Summary")

router.get("/summary/index", (req,res) =>{
    
    Summary.findAll({
        order:[
            ['id','DESC']
        ]
    }).then(summary =>{
        res.render("summary/index",{
            summary: summary,
        })
    }).catch((error)=>{
            console.log("erro to sendo infos")
        })
    
    
    
})

router.get("/summary/admin/new", (req,res) =>{
    res.render("summary/admin/new",{
        message: null,
        messageType: "success"
    })
})

router.post("/summary/admin/save",(req,res)=>{
    var title = req.body.title
    var content = req.body.content
    var type = req.body.type
    var order = req.body.order

    if(title && content){
        Summary.create({
            title: title,
            content: content,
            type:type,
            order: order
        }).then( () => {
            res.render("summary/admin/new",{
                message: "Summary created",
                messageType: "success"
            })
        }).catch(error =>{
            console.log(error);
            res.status(500).send("erro to create summary")

        })
    }else{
        res.render("summary/admin/new",{
            message:"error to create summary",
            messageType:"danger"
        })
    }
})


module.exports = router;
