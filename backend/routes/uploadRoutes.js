import express from 'express'
import multer from 'multer'
import path from 'path'


const router = express.Router()

const storage = multer.diskStorage({
    destination(req, file, cb) {
        cb(null, 'uploads/')
    },
    filename(req,file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`)
    }
})

function chekFileType(file, cb) {
    const filetypes = /jpg|jpeg|png/
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = filetypes.test(file.mimetype)
    console.log(file)
    if (extname && mimetype) {
        return cb(null, true)
    } else {
        cb('Imaes Only!')
    }
}

const upload = multer({storage, fileFilter: function(req, file, cb) {
            chekFileType(file, cb)
}})


router.post('/', upload.single('imageUrl'), (req, res) => {
    console.log(req.file)
    return res.send(`/uploads/${req.file.filename}`)
})


export default router;