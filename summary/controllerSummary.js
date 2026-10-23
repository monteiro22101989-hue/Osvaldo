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
            summary: summary
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

router.get("/summary/read/:id",(req,res)=>{
    var id = req.params.id;


    if(id){
        Summary.findByPk(id).then( summary =>{

            if(!summary){
                return res.redirect("/summary/index");
            }

            res.render("summary/read", {
                summary:summary,
                message: null,
                messageType: "success"
            })
        }).catch(error =>{
            console.log("error:", error)
        })
    }else{
        res.redirect("/summary/index")
    }
})

router.get("/summary/admin/edit/:id", (req,res)=>{
    var id = req.params.id;
    console.log("we get the requisition",id)

    if(isNaN(Number(id))){
        return res.redirect("/summary/index");
    }
    Summary.findByPk(id).then(summary =>{
        if(summary){
            res.render("summary/admin/upDate",{
                summary: summary
            })
        }else{
            res.redirect("/summary/index")
        }
    }).catch(error =>{
        console.log("Error to up date",error)
        res.redirect("/summary/index")
    })
})


router.post("/summary/admin/upDate", (req,res)=>{
    var id = req.body.id;
    var title = req.body.title;
    var content = req.body.content;
    var type = req.body.type;
    var order = req.body.order;

    if(id && title && content){
        Summary.update({
            id:id,
            title:title,
            content:content,
            type:type,
            order:order
        },{
            where: {
                id:id
            }
        }).then(() =>{
            Summary.findByPk(id).then(summary =>{
                res.render("summary/read",{
                    summary: summary,
                    message: "up date done",
                    messageType: "success"
                })
            })
        })
    }
})


router.post("/summary/delete",(req,res)=>{
    var id = req.body.id;

    console.log("Chegou aqui:", id)

    if(isNaN(Number(id))){
        res.redirect("/summary/index");
    }

    Summary.findByPk(id).then(summaries =>{
        if(summaries){
            return summaries.destroy()
        }else{
            return null
        }
    }).then(() =>{
        res.redirect("/summary/index")
    }).catch(error =>{
        console.log(error);
        res.status(500).send("error to delet summary")
    })
})
module.exports = router;
