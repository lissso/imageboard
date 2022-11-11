//below we have information that we need for out db connection
// which db do we talk to?
const database = "imageboard";
// which user is running our queries in the db
const username = "postgres";
// what's the users password
const password = "postgres";

const spicedPg = require("spiced-pg");

const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:${username}:${password}@localhost:5432/${database}`
);
console.log("[db] is connecting to ", database);

module.exports.getImages = () => {
    const q = `SELECT * FROM images 
                ORDER BY id DESC
                LIMIT 8`;
    const param = [];
    return db.query(q, param);
};

module.exports.addImage = (url, username, title, description) => {
    return db.query(
        `INSERT INTO images (url, username, title, description) 
        VALUES ($1, $2, $3, $4) 
        RETURNING * `,
        [url, username, title, description]
    );
};

module.exports.getModalImages = (id) => {
    const q = `SELECT * FROM images WHERE id = $1`;
    const param = [id];
    return db.query(q, param);
};

module.exports.getComments = (image_id) => {
    const q = `SELECT comments.comment, comments.username, comments.created_at
                FROM comments
                WHERE comments.image_id = $1`;
    const param = [image_id];
    return db.query(q, param);
};

module.exports.addComments = (comment, username, image_id) => {
    const q = `INSERT INTO comments (comment, username, image_id)
                VALUES ($1, $2, $3)
                RETURNING * `;
    const param = [comment, username, image_id];
    return db.query(q, param);
};

module.exports.fetchMoreImages = (smallestId) => {
    const q = `SELECT url, title, id, (
        SELECT id FROM images
        ORDER BY id ASC
        LIMIT 1) AS "lowestId"
            FROM images
            WHERE id < $1
            ORDER BY id DESC
            LIMIT 3`;
    const param = [smallestId];
    return db.query(q, param);
};
