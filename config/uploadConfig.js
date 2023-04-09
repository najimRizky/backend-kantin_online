import multer from "multer"

const allowedFile = ["image/png", "image/jpg", "image/jpeg"]

const uploadConfig = multer({
    dest: "uploads/",
    limits: {
        fileSize: 2 * 1024 * 1024 //2mb
    },
    fileFilter: (req, file, callback) => {
        if (allowedFile.includes(file.mimetype)) {
            callback(null, true)
        } else {
            callback(new Error("File not supported"))
        }
    },
})

export default uploadConfig