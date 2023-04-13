const AWS = require('aws-sdk');
const sharp = require('sharp');
require('dotenv').config();

const s3hookConfig = {
    s3Url: process.env.S3_URL,
    thumbnailBucketName: process.env.THUMBNAIL_BUCKET_NAME,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY,
}

module.exports.s3hook = async (event, context) => {

    // S3 instance
    const S3 = new AWS.S3({
        s3ForcePathStyle: true,
        accessKeyId: s3hookConfig.accessKeyId,
        secretAccessKey: s3hookConfig.secretAccessKey,
        endpoint: new AWS.Endpoint(s3hookConfig.s3Url),
    });

    // Retrieve bucket name and file name
    const bucket = event.Records[0].s3.bucket.name;
    const key = decodeURIComponent(event.Records[0].s3.object.key.replace(/\+/g, ' '));
    const params = {Bucket: bucket, Key: key};

    // read image
    const response = await S3.getObject(params).promise();

    // resize
    const thumbnail = await sharp(response.Body)
        .resize(320, 240).toBuffer()

    // save thumbnail
    await S3.putObject({
        Bucket: s3hookConfig.thumbnailBucketName,
        Key: key,
        Body: thumbnail
    }).promise();

    // delete file
    await S3.deleteObject(params).promise();

    return {
        statusCode: 200,
        body: JSON.stringify(
            {
                message: `Thumbnail image with name ${key} was successfully created`,
            }),
    };
};
