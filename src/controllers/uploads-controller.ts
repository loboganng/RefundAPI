import { Request, Response} from "express"
import z, { ZodError} from "zod"

import uploadConfig from "@/configs/upload"
import { DiskStorage } from "@/providers/disk-storage"
import { AppError } from "@/utils/AppError"

class UploadsController {
  async create(request: Request, response: Response){

    const diskStorage = new DiskStorage() //Creating an instance of the DiskStorage class
    // response.json({ file: request.file})
    try {
      const fileSchema = z.object({
        filename: 
          z.string()
          .min(1, "File is required"),
        mimetype: 
          z.string()
          .refine(
            (type) => 
              uploadConfig.ACCEPTED_IMAGE_TYPES.includes(type), 
            `File type is not accepted. Accepted file types: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`
          ),
        size: 
          z.number()
          .positive()
          .refine(
            (size) => 
              size <= uploadConfig.MAX_FILE_SIZE, `File size is too large. Max file size: ${uploadConfig.MAX_SIZE} MB`
          )
      }).passthrough() //Allowing other properties to be passed through

      const file = fileSchema.parse(request.file)
      const filename = await diskStorage.saveFile(file.filename)

      response.json({ filename })
      
    } catch (error) {
      // If the error is a ZodError, it means that the file validation failed. 
      // In this case, we need to delete the file from the temporary folder if it exists, 
      // to avoid leaving unnecessary files in the server.
      if (error instanceof ZodError) {
        if (request.file) {
          await diskStorage.deleteFile(request.file.filename, "tmp")
        }

        // We throw a new AppError with the message of the first issue in the ZodError, 
        // to provide a more user-friendly error message.
        throw new AppError(error.issues[0].message)
      }
      throw error
    }

  }
}

export { UploadsController }