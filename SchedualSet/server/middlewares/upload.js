//이미지 업로드용 미들웨어

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (requ, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const allowed = ['image/jpeg', 'image/png'];
        if (allowed.includes(file.mimetype)) {
            cb(null,true);
        } else {
            cb(new Error('지원하지 않는 형식입니다'), false);
        }
    }
});

module.exports = upload;