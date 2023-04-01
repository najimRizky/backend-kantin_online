import fs from "fs"
import { BucketConfig, BucketParams } from "./../config/bucketConfig.js"
import mime from "mime-types"
import { nanoid } from "nanoid"
import { DeleteObjectCommand, PutObjectCommand, S3Client } from "@aws-sdk/client-s3"

const S3 = new S3Client({
    region: "auto",
    endpoint: BucketConfig.endpoint,
    credentials: {
        accessKeyId: BucketConfig.accessKeyId,
        secretAccessKey: BucketConfig.secretAccessKey
    }
})
const CLOUDFLARE_PUBLIC_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_BUCKET_URL

const uploadToBucket = async ({ req, currentUrl }) => {
    const { path, mimetype, filename } = req.file
    const extension = mime.extension(mimetype)

    const uniqueFileName = nanoid(3) + filename;

    const Body = fs.createReadStream(path)
    const Key = `${uniqueFileName}.${extension}`

    const params = new PutObjectCommand({
        ...BucketParams,
        Body,
        Key
    })

    const deleteOldFile = async () => {
        const fileNameWithExt = currentUrl.substring(currentUrl.lastIndexOf("/") + 1)
        const deleteParams = new DeleteObjectCommand({
            ...BucketParams,
            Key: fileNameWithExt
        })

        S3.send(deleteParams)
    }

    return new Promise((resolve, reject) => {
        S3.send(params)
            .then((_) => {
                fs.unlinkSync(path); // delete
                const url = `${CLOUDFLARE_PUBLIC_BUCKET_URL}/${Key}`;

                if (currentUrl !== "") {
                    deleteOldFile()
                }

                resolve(url)
            }).catch((err) => {
                reject(err)
            }).finally
    })
}

export default uploadToBucket