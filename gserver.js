const express = require("express");
const session = require("express-session")({
    secret: "underthebridge",
    name: "genshinSessionID",
    resave: true,
    // create a unique identifier for that client
    saveUninitialized: true
});

const mysql = require("mysql2");
const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "borrowbuddy"
});

const app = express();
const fs = require("fs");
const {
    JSDOM
} = require("jsdom");
const bodyparser = require("body-parser");

// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
app.use("/media", express.static("./public/media"));
// body-parser middleware use
app.use(bodyparser.json());
app.use(
    bodyparser.urlencoded({
        extended: true,
    })
);

app.use(session);

app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/home");
    } else {
        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.set("Server", "NS0 Engine");
        res.set("X-Powered-By", "Nerdslayer0");
        res.send(doc);
    }
});

app.get("/home", function (req, res) {
    // check for a session first!
    if (req.session.loggedIn) {
        let mainDOM = wrap("./app/html/home.html", req.session);
        res.set("Server", "NS0 Engine");
        res.set("X-Powered-By", "Nerdslayer0");
        res.send(mainDOM.serialize());
    } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }
});

/* ----- login ----- */
app.post("/login", function (req, res) {
    res.setHeader("Content-Type", "application/json");
    connection.query(`SELECT * FROM bb_user WHERE user_name = ? AND password = ?`,
        [req.body.username, req.body.password],
        function (error, results) {
            if (error || !results || !results.length) {
                if (error) console.log(error);
                res.send({
                    status: "fail",
                    msg: "User account not found."
                });
            } else {
                // user authenticated, create a session
                req.session.loggedIn = true;
                req.session.lastname = results[0].last_name;
                req.session.name = results[0].user_name;
                req.session.userID = results[0].ID;
                req.session.username = results[0].first_name;
                req.session.isAdmin = results[0].is_admin;
                req.session.userImage = results[0].user_image;
                req.session.pass = results[0].password;

                req.session.save((error) => {
                    if (error) console.log(error);
                });

                // all we are doing as a server is telling the client that they
                // are logged in, it is up to them to switch to the profile page
                res.send({
                    status: "success",
                    msg: "Logged in.",
                    isAdmin: (results[0].is_admin == 1)
                });
            }
        });
});

app.get("/logout", function (req, res) {
    if (req.session) {
        req.session.destroy(function (error) {
            if (error) {
                res.status(400).send("Unable to log out");
            } else {
                // session deleted, redirect to home
                res.redirect("/");
            }
        });
    }
});

// loads template content
function wrap(filename, session) {
    let template = fs.readFileSync("./app/html/template.html", "utf8");
    let dom = new JSDOM(template);
    dom.window.document.getElementById("templateContent").innerHTML = fs.readFileSync(filename, "utf8");
    dom.window.document.getElementById("name").innerHTML = "WELCOME " + session.username.toUpperCase();

    return dom;
}

let port = process.env.PORT || 8000;

// const connection = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: 8000,
//     user: "root",
//     password: "",
//     database: "borrowbuddy"
// });

app.use(function (req, res, next) {
    res.status(404).send("<html><head><title>Page not found!</title></head><body><p>Nothing here.</p></body></html>");
});

app.listen(port, function () {
    console.log("Example app listening on port " + port + "!");
});

