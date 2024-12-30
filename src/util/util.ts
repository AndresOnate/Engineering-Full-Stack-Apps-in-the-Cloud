import fs from "fs";
import Jimp = require("jimp");
import axios from "axios";

// filterImageFromURL
// helper function to download, filter, and save the filtered image locally
// returns the absolute path to the local image
// INPUTS
//    inputURL: string - a publicly accessible url to an image file
// RETURNS
//    an absolute path to a filtered image locally saved file
export async function filterImageFromURL(inputURL: string): Promise<string> {
  return new Promise(async (resolve, reject) => {
    try {
      // Descargar la imagen usando axios
      const response = await axios.get(inputURL, { responseType: "arraybuffer" });
      const buffer = Buffer.from(response.data, "binary");

      // Procesar la imagen con Jimp
      const photo = await Jimp.read(buffer);
      const outpath = "/tmp/filtered." + Math.floor(Math.random() * 2000) + ".jpg";

      await photo
        .resize(256, 256) // Cambiar tamaño
        .quality(60) // Reducir calidad para optimización
        .greyscale() // Convertir a escala de grises
        .writeAsync(__dirname + outpath); // Guardar la imagen procesada

      resolve(__dirname + outpath);
    } catch (error) {
      console.error("Error procesando la imagen:", error);
      reject("Unable to process the image from the provided URL.");
    }
  });
}

// deleteLocalFiles
// helper function to delete files on the local disk
// useful to cleanup after tasks
// INPUTS
//    files: Array<string> an array of absolute paths to files
export async function deleteLocalFiles(files: Array<string>) {
  for (let file of files) {
    fs.unlinkSync(file);
  }
}
