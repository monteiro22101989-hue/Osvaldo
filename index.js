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

// middleware session
const session = require("express-session")
const adminauth = require("./middlewares/adminAuth");

app.use(session ({
    secret: "qualquercoisa",
    resave: false, //nao necessario - expresses nao salva a sessao novamente se nao necessario
    saveUninitialized: false //nao necessario - nao salva a sessao se ela ainda nao tiver sido modificada
}))

// pra upload de imagens

app.set("view engine", "ejs");


app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static("public"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));// pra upload de imagens
app.use((req, res, next) => { // todos os lugares vao receber pagina publica "falsa por default", isso ta validando o que vai aparecer na pagina da navbar do login, pra nao aparecer as opcoes la

    res.locals.paginaPublica = false;
    next();
});

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
    res.locals.paginaPublica = true;
    res.render("user/login");
});

app.get("/index", adminauth,(req, res) => {
    res.locals.paginaPublica = false;
    res.render("index");
});

console.log("Vou iniciar o servidor");

app.listen(3000, () => {
    console.log("servidor rodando");
});