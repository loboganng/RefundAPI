import fs from "node:fs"  //Filesystem module to work with files and directories
import path from "node:path"

import uploadConfig from "@/configs/upload"

class DiskStorage {
  async saveFile(file: string){ //Method to save the file in the uploads folder
    const tmpPath = path.resolve(uploadConfig.TMP_FOLDER, file) //Temp file path
    const destPath = path.resolve(uploadConfig.UPLOADS_FOLDER, file)  //Destination file path

    try {
      await fs.promises.access(tmpPath) //Check if the file exists in the temp folder
      
    } catch (error) {
      console.log(error)
      throw new Error(`File not found: ${tmpPath}`)
    }

    await fs.promises.mkdir(uploadConfig.UPLOADS_FOLDER, { recursive: true }) //Create the uploads folder if it doesn't exist
    await fs.promises.rename(tmpPath, destPath) //Move the file from the temp folder to the uploads folder
    // *RENAME is to move the file, not rename it*

    return file;
  }

  async deleteFile(file: string, type: "tmp"| "uploads"){
    const pathFile = 
    //If the type is "tmp", the file is in the temp folder, otherwise it's in the uploads folder
      type == "tmp" ? uploadConfig.TMP_FOLDER : uploadConfig.UPLOADS_FOLDER

      //File path
      const filePath = path.resolve(pathFile, file)

      //Check if the file exists, if it doesn't exist, return
      try {
        await fs.promises.stat(filePath)  //Stat is to check if the file exists, if it doesn't exist, it will throw an error
      } catch {
        return
      }

      await fs.promises.unlink(filePath) //Delete the file
  }
}

export { DiskStorage }