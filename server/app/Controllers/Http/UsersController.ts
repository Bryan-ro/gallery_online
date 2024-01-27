import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Routes from "@ioc:Adonis/Core/Route";

import Mail from "@ioc:Adonis/Addons/Mail";

import User from "App/Models/User";
import CreateUser from "App/Validators/CreateUserValidator";
import UpdateUser from "App/Validators/UpdateUserValidator";

export default class UsersController {
  public async index({ auth }: HttpContextContract) {
    return {
      name: auth.user?.$attributes.name,
      email: auth.user?.$attributes.email,
    };
  }

  public async create({ request, response }: HttpContextContract) {
    const user = await request.validate(CreateUser);

    await User.create(user);

    return response.created({
      message: "User successfully created",
    });
  }

  public async update({ auth, request }: HttpContextContract) {
    const payload = await request.validate(UpdateUser);
    const userId = auth.user?.$attributes.id;

    try {
      if (payload.name) {
        await User.query().where("id", userId).update({ name: payload.name });
      }

      if (payload.email) {
        const signedUrl = Routes.builder()
          .prefixUrl(`${request.secure() ? "https://" : "http://"}${request.host()}`)
          .params({ id: userId, email: payload.email })
          .makeSigned("confirmEmailUpdate", { expiresIn: "10m" });

        Mail.send((message) => {
          message
            .from("Online Gallery")
            .to(payload.email as string)
            .subject("E-mail update")
            .htmlView("emails/verify_email", { name: auth.user?.$attributes.name, url: signedUrl });
        });

        return "Confirmation email successfully send";
      }

      return "User successfully update";
    } catch (error) {
      return "Update Error";
    }
  }

  public async confirmEmailForUpdate({ request, response, view }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.unauthorized("Invalid signature");
    }

    try {
      await User.query()
        .where("id", request.param("id"))
        .update({ email: request.param("email") });

      return view.render("auth/verified");
    } catch {
      return response.badRequest("Update email failed");
    }
  }

  public async delete({ response, auth }: HttpContextContract) {
    try {
      await User.query().where("id", auth.user?.$attributes.id).delete();

      return "User deleted successfully";
    } catch {
      return response.badRequest("Delete user failed");
    }
  }
}
