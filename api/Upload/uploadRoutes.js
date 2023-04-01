import express from "express"
import multer from "multer"
import fs from "fs"
import { BucketConfig, BucketParams } from "./../../config/bucketConfig.js"
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3"
import errorHandler from "../../helper/errorHandler.js"

const upload = multer({ dest: "uploads/" })
const router = express.Router()

const S3 = new S3Client({
    region: "auto",
    endpoint: BucketConfig.endpoint,
    credentials: {
        accessKeyId: BucketConfig.accessKeyId,
        secretAccessKey: BucketConfig.secretAccessKey
    }
})
const CLOUDFLARE_PUBLIC_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_BUCKET_URL

/** @see /upload */

router.post('/', upload.single("images"), async (req, res) => {
    const path = req.file.path
    const Body = fs.createReadStream(path)
    const Key = req.file.originalname
    
    const params = new PutObjectCommand({
        ...BucketParams,
        Body,
        Key
    })

    try {
        const data = await S3.send(params)
        fs.unlinkSync(path); // delete
        const url = `${CLOUDFLARE_PUBLIC_BUCKET_URL}/${Key}`;
        
        return res.send({ url, data })
    } catch (err) {
        fs.unlinkSync(path); // delete
        return errorHandler(err, res)
    }
});

export default router