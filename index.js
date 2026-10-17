const express = require('express');
const app = express();
const bodyparser = require("body-parser");
const connection = require("./database/database");
const Capitulo = require("./chapter/Chapter")
const controllerChapter = require("./chapter/controllerChapter");
const Character = require("./characters/Character")
const controllerCharacter = require("./characters/controllerCharacter");
const Summary = require("./summary/Summary");
const controllerSummary = require("./summary/controllerSummary");
const Event = require("./event/Event");
const controllerEvent = require("./event/controllerEvent");
const controllerUser = require("./user/controllerUser");
const User = require("./user/User"); 

app.set("view engine", "ejs");


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("public"));


connection 
    .authenticate()
    .then(() =>{
        console.log("conection ok");
        return connection.sync({ force: false });
    })
    .then(() => {
        console.log("Tabelas sincronizadas!");
    })
    .catch((error)=>{
        console.log(error);
    })




//rotes controller chapter
app.use("/",controllerChapter);
app.use("/",controllerCharacter);
app.use("/",controllerSummary);
app.use("/", controllerEvent);
app.use("/",controllerUser);

app.get("/", (req, res) =>{
    res.render("index")
})


app.listen( 3000, () =>{
    console.log("servidor rodando")
})