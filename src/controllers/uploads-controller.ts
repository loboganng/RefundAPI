import { Request, Response} from "express"
import z from "zod"

import uploadConfig from "@/configs/upload"

class UploadsController {
  async create(request: Request, response: Response){
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
            `File type is not accepted. Accepted fily types: ${uploadConfig.ACCEPTED_IMAGE_TYPES}`
          ),
        size: 
          z.number()
          .positive()
          .refine(
            (size) => 
              size <= uploadConfig.MAX_FILE_SIZE, `File size is too large. Max file size: ${uploadConfig.MAX_SIZE} MB`
          )
      }).passthrough() //Allowing other properties to be passed through

      const { file } = fileSchema.parse(request.file)

      response.json({ message: "File uploaded successfully" })
      
    } catch (error) {
      throw error
    }

  }
}

export { UploadsController }