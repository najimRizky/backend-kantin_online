import fs from "fs"
import AWS from "aws-sdk"
import { BucketConfig, BucketParams } from "./../config/bucketConfig.js"
import mime from "mime-types"
import { nanoid } from "nanoid"

const S3 = new AWS.S3(BucketConfig)
const CLOUDFLARE_PUBLIC_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_BUCKET_URL

const uploadToBucket = async ({ req, currentUrl }) => {
    const { path, mimetype, filename } = req.file
    const extension = mime.extension(mimetype)

    const fileNameWithExt = currentUrl === "" ? "" : currentUrl.substring(currentUrl.lastIndexOf("/") + 1)
    const currentFileName = currentUrl === "" ? "" : fileNameWithExt.substring(0, fileNameWithExt.lastIndexOf("."));

    const uniqueFileName = currentFileName === "" ? nanoid(5) + filename : currentFileName;

    const params = {
        ...BucketParams,
        Body: fs.createReadStream(path),
        Key: `${uniqueFileName}`
    }

    return new Promise((resolve, reject) => {
        S3.upload(params, async (err, data) => {
            if (err) {
                reject(err)
            }
            if (data) {
                fs.unlinkSync(path); // delete
                const url = `${CLOUDFLARE_PUBLIC_BUCKET_URL}/${data.Key}.${extension}`;
                resolve(url)
            }
        });
    })
}

export default uploadToBucket