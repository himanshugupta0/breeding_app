const multer = require('multer');
const uuidv4 = require('uuid').v4;

//multers disk storage settings
let storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './uploads/') // file will be saved in uploads folder
    },
    filename: function (req, file, cb) {
        let file_name = `${uuidv4()}-${file.originalname}`
        cb(null, file_name);
    }
});

//multer settings
module.exports.localUpload = multer({
    storage: storage,
}).single('image');
