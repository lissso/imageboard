// all logs are serverside look at the terminal

const express = require("express");
const db = require("./db");
const s3 = require("./s3");
const s3Url = "https://s3.amazonaws.com/spicedling/";

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const app = express();

/////////////////////////////////////////////////////////////

app.use(express.json());

app.use(express.urlencoded({ extended: false }));

app.use(express.static("./public"));

/////////////////////////////////////////////////////////////

app.get("/images", (req, res) => {
    console.log("images");

    db.getImages()
        .then((results) => {
            const images = results.rows;
            // console.log("images ===>", images);
            res.json(images);
        })
        .catch((err) => {
            console.log("error is ", err);
        });
});

app.get("/modal/:id", (req, res) => {
    const id = req.params.id;
    console.log("req.params;", req.params);

    db.getModalImages(id)
        .then((result) => {
            if (result.rows[0]) {
                res.json(result.rows[0]);
            } else {
                res.json({});
            }
        })
        .catch((err) => {
            console.log("error in modal images: id", err);
        });
});

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, "uploads");
    },
    filename(req, file, callback) {
        // work here
        // -create random file name
        // -pick up the filename extenstion and save it too
        const randomFileNumber = uidSafe(24).then((randomString) => {
            // keep original file extension
            console.log("file: ", file);
            callback(null, `${randomString}${path.extname(file.originalname)}`);
        });
    },
});

const uploader = multer({
    storage: storage,
    limits: {
        fileSize: 4197152,
    },
});

/////////////////////////////////////////////////////////////
// UPLOAD IMAGES

//"image" must be the same name like in the input field
app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    console.log("*****************");
    console.log("POST /upload.json Route");
    console.log("*****************");
    console.log("file:", req.file);
    console.log("input:", req.body);
    console.log(
        "our img can be found at url?",
        "this willl be a url containing s3.amazonaw.com somewhere there is the bucket, and somewhere there is alos the image name involved"
    );
    // now it's time to store the url, and all other data in the database
    // return the values to the server
    // and have the server send the newly add image data back to the
    // clientside
    let url = s3Url + req.file.filename;
    console.log("url ==> ", url);

    if (req.file) {
        db.addImage(url, req.body.user, req.body.title, req.body.description)
            .then((result) => {
                console.log(result.rows[0]);
                res.json({
                    success: true,
                    payload: result.rows[0],
                });
            })
            .catch((err) => {
                console.log("error is ", err);
            });
    } else {
        res.json({
            success: false,
        });
    }
});

/////////////////////////////////////////////////////////////
// FETCH MORE IMAGES

app.get("/moreButton/:id", (req, res) => {
    db.fetchMoreImages(req.params.id)
        .then((result) => {
            res.json({
                sucess: true,
                payload: result.rows,
            });
        })
        .catch((err) => {
            console.log("error is more Button ", err);
        });
});

/////////////////////////////////////////////////////////////
// COMMENTS

app.get("/comments/:imageId", (req, res) => {
    db.getComments(req.params.imageId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => console.log("error in comments ==>", err));
});

app.post("/comment", (req, res) => {
    db.addComments(req.body.comment, req.body.username, req.body.image_id)
        .then((result) => {
            res.json({
                success: true,
                payload: result.rows[0],
            });
        })
        .catch((err) => {
            console.log("error in add comments", err);
        });
});

/////////////////////////////////////////////////////////////

app.get("*", (req, res) => {
    res.sendFile(`${__dirname}/index.html`);
});

/////////////////////////////////////////////////////////////

app.listen(8080, () => console.log(`I'm listening.`));

/////////////////////////////////////////////////////////////

////after middlewear

// var cities = [
//     {
//         id: 1,
//         name: "Berlin",
//         country: "DE",
//     },
//     {
//         id: 2,
//         name: "Guayaquil",
//         country: "Ecuador",
//     },
//     {
//         id: 3,
//         name: "WAShington DC.",
//         country: "USA",
//     },
// ];

// app.get("/cities", (req, res) => {
//     console.log("/cities route have been hit");
//     res.json(cities);
//     //res.json when you only work with templates
// });
