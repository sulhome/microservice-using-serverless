const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const uploadImage = async () => {
    const imagePath = path.resolve(__dirname, 'resources/beach.jpeg');
    const image = fs.readFileSync(imagePath);
    const S3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: "S3RVER",
        secretAccessKey: "S3RVER",
        endpoint: new AWS.Endpoint("http://localhost:4569"),
    });
    await S3.putObject({
        Bucket: "photos",
        Key: "beach.jpeg",
        Body: image
    }).promise();
}

uploadImage()
    .then(() => console.log("Image uploaded successfully"));