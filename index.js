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
const path = require("path"); 
// pra upload de imagens

app.set("view engine", "ejs");


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));// pra upload de imagens


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
console.log("Passei pelos controllers");

app.use("/", controllerUser);

app.get("/", (req, res) => {
    res.render("index");
});

console.log("Vou iniciar o servidor");

app.listen(3000, () => {
    console.log("servidor rodando");
});