"use strict";
const express = require("express");
const Unblocker = require("unblocker");
const CleanCSS = require('clean-css');
const bodyParser = require('body-parser');
const path = require("node:path")
const fs = require("node:fs")
const blacklist = require("./util/blacklist");

const unblocker = Unblocker({
    requestMiddleware: [
      blacklist({
        blockedDomains: ["pornhub.com", "porn.com", "xvideos.com"],
        message: "Damn bro you that down bad?",
      }),
    ],
    prefix: "/unblock/"
  });

//-Webserver-//
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/pages'))
app.disable("x-powered-by")

app.use(unblocker);

app.get('/css/main.css', (req, res) => {
    const originalCSS = fs.readFileSync('static/main.css', 'utf8');
    var options = { };
    const minifiedCSS = new CleanCSS(options).minify(originalCSS);
    res.set('Content-Type', 'text/css');
    res.send(minifiedCSS.styles);
  })

app.get("/", (req, res) =>
 res.render("index.ejs", { req })
);

app.post("/go", async (req, res) => {
    return res.redirect(`/unblock/${req.body.website}`);
})

app.listen(80, () => {
    console.info("[INFO] Running on port 80")
}).on("upgrade", unblocker.onUpgrade);