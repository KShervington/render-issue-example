const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const http = require('http');
const mysql = require('mysql');

// let initial_path = path.join(__dirname, "public");
let initial_path = path.join(__dirname, "public");

const app = express();
app.use(express.static(initial_path));
app.use(fileupload());
app.use(express.json());

app.get('/', (req, res) => {
    res.sendFile(path.join(initial_path, "index.html"));
})

app.get('/editor', (req, res) => {
    res.sendFile(path.join(initial_path, "editor.html"));
})

// upload link
app.post('/upload', (req, res) => {
    let file = req.files.image;
    let date = new Date();
    // image name
    let imagename = date.getDate() + date.getTime() + file.name;
    // image upload path
    let path = 'public/uploads/' + imagename;

    // create upload
    file.mv(path, (err, result) => {
        if (err) {
            throw err;
        } else {
            // our image upload path
            res.json(`uploads/${imagename}`)
        }
    })
})

app.use('/tinymce', express.static(path.join(__dirname, 'node_modules', 'tinymce')));

app.get("/:blog", (req, res) => {
    res.sendFile(path.join(initial_path, "blog-single.html"));
})

// posting for ajax
app.post('/test', function (req, res) {
    console.log('receiving data ...');
    console.log('body is ', req.body);
    res.send(req.body);
});

// Inserting into database
app.post('/db_insert', (req, res) => {

    // assign connection parameters
    let con = mysql.createConnection({
        host: "kyleshervington.com",
        user: "kylesher_admin",
        password: "Titanic2016Olympians!",
        database: "kylesher_blog_posts"
    });

    // connect to database
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        var titleText = con.escape(req.body.title);
        var bodyText = con.escape(req.body.bodyText);
        var mediaPath = con.escape(req.body.mediaPath);
        var postId = con.escape(req.body.Post_id);

        // create insert query
        let newQuery = '';
        newQuery = `INSERT INTO Posts (Title, BodyText, MediaType, MediaPath, Post_id) VALUES (${titleText}, ${bodyText}, \'${req.body.mediaType}\', ${mediaPath}, ${postId})`;
        // newQuery = "INSERT INTO Posts (Title, BodyText, MediaType, MediaPath, Post_id) VALUES ('" + req.body.title + "', '" + req.body.bodyText + "', '" + req.body.mediaType + "', '" + req.body.mediaPath + "', '" + req.body.Post_id + "')";

        con.query(newQuery, function (err, result) {
            if (err) throw err;
            console.log("1 record inserted");

        });

        con.end(function (err) {
            if (err) throw err;
            console.log("Disconnected!");

        });

        res.status(200).json({ success: true });
    });

})

// Inserting into database
app.get('/db_getPost/:blogId', (req, res) => {

    // assign connection parameters
    let con = mysql.createConnection({
        host: "kyleshervington.com",
        user: "kylesher_admin",
        password: "Titanic2016Olympians!",
        database: "kylesher_blog_posts"
    });

    // connect to database
    con.connect(function (err) {
        if (err) throw err;
        console.log("Connected!");

        // Execute SELECT query
        con.query("SELECT * FROM Posts WHERE Post_id=" + con.escape(req.params['blogId']), function (err, result, fields) {
            if (err) throw err;

            console.log(result[0]);
            //res.send(result[0]);
            res.status(200).json(result[0]);

        });

        con.end(function (err) {
            if (err) throw err;
            console.log("Disconnected!");

        });
    });

})

app.use(function (err, req, res, next) {
    // 'SyntaxError: Unexpected token n in JSON at position 0'
    err.message;
    next(err);
});

app.listen("3000", () => {
    console.log('listening......');
})