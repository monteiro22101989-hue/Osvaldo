const express = require("express");
const router = express.Router();

router.get("/summary/index", (req,res) =>{
    res.render("summary/index");
})



module.exports = router;
