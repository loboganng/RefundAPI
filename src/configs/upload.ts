import multer from "multer"
import path from "node:path"
import crypto from "node:crypto"

//Temporary folder before uploading to the backend
const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp")
const UPLOADS_FOLDER = path.resolve(TMP_FOLDER, "uploads")

const MAX_FILE_SIZE = 1024 * 1024 * 3 // 3MB max file size
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "imagem/png"]

//Creating Multer object with the configuration
const MULTER = {
  storage: multer.diskStorage({ //Method that allows us to configure the storage of the files
    destination: TMP_FOLDER, //Where the files will be stored
    filename: (req, file, callback) => { //Method that allows us to configure the name of the files
      const fileHash = crypto.randomBytes(10).toString("hex") //Generating a random hash for the file name
      const fileName = `${fileHash}-${file.originalname}` //Creating the file name with the hash and the original name

      return callback(null, fileName)
    }
  }),
}

export {
  TMP_FOLDER,
  UPLOADS_FOLDER,
  MULTER,
  MAX_FILE_SIZE,
  ACCEPTED_IMAGE_TYPES
}