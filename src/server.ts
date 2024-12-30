import express, { Request, Response } from "express";
import bodyParser from "body-parser";
import { filterImageFromURL, deleteLocalFiles } from "./util/util";

(async () => {
  const app = express();
  const port = process.env.PORT || 8081;

  app.use(bodyParser.json());

  function validateURL(pURL: string): boolean {
    var regexQuery = "^(https?://)?(www\\.)?([-a-z0-9]{1,63}\\.)*?[a-z0-9][-a-z0-9]{0,61}[a-z0-9]\\.[a-z]{2,6}(/[-\\w@\\+\\.~#\\?&/=%]*)?$";
    var url = new RegExp(regexQuery,"i");
    return url.test(pURL);
  }

  app.get("/filteredimage", async(req: Request, res: Response): Promise<any> => {
    const imageUrl = req.query.image_url;
    if (typeof imageUrl !== "string") {
      return res.status(400).send("image_url must be a string");
    }
    if (!validateURL(imageUrl)) {
      return res.status(422).send("Invalid image_url");
    }
    try {
      const filteredPath = await filterImageFromURL(imageUrl);

      res.sendFile(filteredPath, (err) => {
        if (err) {
          console.error("Error sending file:", err);
          res.status(500).send("Error processing image");
        }
        deleteLocalFiles([filteredPath]);
      });
    } catch (error) {
      console.error("Error filtering image:", error);
      res.status(500).send("Could not process the image");
    }
  });

  app.get("/", (req: Request, res: Response) => {
    res.send("Try GET /filteredimage?image_url={{URL}}");
  });

  app.listen(port, () => {
    console.log( `server running http://localhost:${ port }` );
    console.log("press CTRL+C to stop server");

  });
})();
