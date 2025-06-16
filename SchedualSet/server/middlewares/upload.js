//이미지 업로드용 미들웨어

const path = require('path');
const multer = require('multer');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}_${Math.round(Math.random() * 1E9)}${ext}`;
        cb(null, uniqueName);
    }
});

const blockedExtensions = [
    '.exe', '.msi', 'bat', '.sh', '.apk', '.dmg',
    '.jar', '.dll', '.sys', '.iso', '.php', '.jsp', '.asp'
];

const upload = multer({
    storage,
    limits: { fileSize: 2 * 1024 * 1024},
    fileFilter: (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();

        if (blockedExtensions.includes(ext)) {
            cb (new Error('이 형식의 파일은 업로드 할 수 없습니다.'), false);

        } else {
            cb (null,true);
        }
    }
});

module.exports = upload;