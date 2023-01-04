const express = require('express');
const path = require('path');
const fileupload = require('express-fileupload');
const http = require('http');
const mysql = require('mysql');
const PORT = process.env.PORT || 3000;

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

app.use(function (err, req, res, next) {
    // 'SyntaxError: Unexpected token n in JSON at position 0'
    err.message;
    next(err);
});

app.listen("PORT", () => {
    console.log(`listening on port: ${PORT}......`);
})
