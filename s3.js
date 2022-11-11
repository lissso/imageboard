const aws = require("aws-sdk");
const fs = require("fs");

let secrets;

if (process.env.NODE_ENV === "production") {
    secrets = process.env;
} else {
    secrets = require("./secrets.json");
}

const s3 = new aws.S3({
    accessKeyId: secrets.AWS_KEY,
    secretAccessKey: secrets.AWS_SECRET,
});

module.exports.upload = (req, res, next) => {
    if (!req.file) {
        console.log("no file on req.body");
        return res.sendStatus(500);
    }
    const { filename, mimetype, size, path } = req.file;

    const promise = s3
        .putObject({
            Bucket: "spicedling", //folder in cloud 
            ACL: "public-read",
            Key: filename,
            Body: fs.createReadStream(path),
            ContentType: mimetype,
            ContentLength: size,
        })
        .promise();

    promise
        .then(() => {
            console.log("yay it worked");
            next(); //want to exit middlewear after uploading image to the cloud
            fs.unlink(path, () => {});
        })
        .catch((err) => {
            console.log("something went wrong with the cloud upload", err);
            return res.sendStatus(500);
        });
};
