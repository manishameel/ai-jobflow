const multer = require('multer');
const { CloudinaryStorage} = require('multer-storage-cloudinary');
const cloudinary = require('./cloudinary');

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'resumes',
        resource_type: 'raw',
        allowed_formats: ['pdf']
    }
});

const upload = multer({storage: storage});

module.exports = upload;