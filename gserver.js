const app = express();


// static path mappings
app.use("/js", express.static("./public/js"));
app.use("/css", express.static("./public/css"));
app.use("/imgs", express.static("./public/imgs"));
app.use("/fonts", express.static("./public/fonts"));
app.use("/html", express.static("./public/html"));
app.use("/media", express.static("./public/media"));

app.use(session);
app.get("/", function (req, res) {
    if (req.session.loggedIn) {
        res.redirect("/main");
    } else {

        let doc = fs.readFileSync("./app/html/index.html", "utf8");
        res.set("Server", "NS0 Engine");
        res.set("X-Powered-By", "Nerdslayer0");
        res.send(doc);
    }
});

app.get("/main", function (req, res) {
    // check for a session first!
    if (req.session.loggedIn) {
        let mainDOM = wrap("./app/html/main.html", req.session);
        res.set("Server", "Wazubi Engine");
        res.set("X-Powered-By", "Wazubi");
        res.send(mainDOM.serialize());
    } else {
        // not logged in - no session and no access, redirect to home!
        res.redirect("/");
    }

});

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: "root",
    password: process.env.DB_PASSWORD,
    database: "COMP2800"
});

let port = process.env.PORT || 8000;
