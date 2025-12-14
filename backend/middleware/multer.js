import multer from "multer";

const storage = multer.memoryStorage(); // store file in memory buffer

export const singleUpload = multer({ storage }).single('file'); // use the storage
