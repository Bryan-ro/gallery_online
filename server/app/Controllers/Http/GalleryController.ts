import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Application from "@ioc:Adonis/Core/Application";

import { v4 as uuidv4 } from "uuid";

import Gallery from "App/Models/Gallery";
import path from "path";

export default class GalleriesController {
  private imagePath = path.join(__dirname, "../../../private");

  public async index({ response, request, auth }: HttpContextContract) {
    try {
      const images = await Gallery.query().where("user_id", auth.user?.$attributes.id).select();

      return images.map((image) => {
        return `${request.secure() ? "https://" : "http://"}${request.host()}/gallery/${image.image}`;
      });
    } catch {
      return response.internalServerError("Internal server error");
    }
  }

  public async getOneImage({ response, request, auth }: HttpContextContract) {
    const imageName = request.param("imageName");

    try {
      const image = await Gallery.findByOrFail("image", imageName);

      if (image.user_id !== auth.user?.$attributes.id) {
        return response.unauthorized("Not authorized");
      }

      return response.download(`${this.imagePath}/${imageName}`);
    } catch {
      return response.badRequest("Image not found");
    }
  }

  public async create({ request, response, auth }: HttpContextContract) {
    const images = request.files("image", { extnames: ["jpg", "png"], size: " 2MB" });

    if (images.length === 0) {
      return response.badRequest("No images were provided");
    }

    images.map(async (image) => {
      const newFileName = uuidv4() + "." + image.extname;

      image.move(Application.makePath("/private"), {
        name: newFileName,
      });

      await Gallery.create({
        image: newFileName,
        user_id: auth.user?.$attributes.id,
      });
    });

    return response.created("Images successfully uploaded.");
  }
}
