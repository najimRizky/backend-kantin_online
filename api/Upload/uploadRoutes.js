import express from "express"
import multer from "multer"
import fs from "fs"
import AWS from "aws-sdk"
import bcrypt from "bcrypt"
import { BucketConfig, BucketParams } from "./../../config/bucketConfig.js"

const upload = multer({ dest: "uploads/" })
const router = express.Router()
const S3 = new AWS.S3(BucketConfig)
const CLOUDFLARE_PUBLIC_BUCKET_URL = process.env.CLOUDFLARE_PUBLIC_BUCKET_URL


/** @see /upload */

router.post('/', upload.single("images"), async (req, res) => {
    const path = req.file.path
    const params = {
        ...BucketParams,
        Body: fs.createReadStream(path),
        Key: req.file.filename
    }
    console.log(req.file)

    S3.upload(params, (err, data) => {
        if (err) {
            return res.status(500).send(err)
        }
        if (data) {
            fs.unlinkSync(path); // delete
            const url = `${CLOUDFLARE_PUBLIC_BUCKET_URL}/${data.Key}`;
            return res.send({ url, data })
        }
    });
});

export default router