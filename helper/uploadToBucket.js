import fs from "fs"
import AWS from "aws-sdk"
import { BucketConfig, BucketParams } from "./../config/bucketConfig.js"
import mime from "mime-types"
import { nanoid } from "nanoid"

const S3 = new AWS.S3(BucketConfig)
const CLOUDFLARE_PUBLIC_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_BUCKET_URL

const uploadToBucket = async ({ req }) => {
    const { path, mimetype, filename } = req.file
    const extension = mime.extension(mimetype)

    const uniqueFileName = nanoid(5) + filename

    const params = {
        ...BucketParams,
        Body: fs.createReadStream(path),
        Key: `${uniqueFileName}.${extension}`
    }

    return new Promise((resolve, reject) => {
        S3.upload(params, async (err, data) => {
            if (err) {
                reject(err)
            }
            if (data) {
                fs.unlinkSync(path); // delete
                const url = `${CLOUDFLARE_PUBLIC_BUCKET_URL}/${data.Key}`;
                resolve(url)
            }
        });
    })
}

export default uploadToBucket