import multer from 'multer';

const storage = multer.diskStorage({
    filename: function (req, file, callback) {
        callback(null,file.originalname);
    }
})


const upload = multer({storage})

export default upload;
//this will upload the image to the local storage, and we need to create a route for this