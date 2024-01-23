import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from "@ioc:Adonis/Core/Hash";

import User from "App/Models/User";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const encodedCredentilas = request.header("authorization") ?? "";

    const decodeCredentilas = Buffer.from(encodedCredentilas.split(" ")[1], "base64").toString("utf-8");

    const [email, password] = decodeCredentilas.split(":");

    try {
      const user = await User.query().where("email", email).firstOrFail();

      if (!(await Hash.verify(user.password, password))) {
        return response.unauthorized("Invalid credentials");
      }

      const token = await auth.use("jwt").generate(user);

      response.ok("Sucessfully logged in");

      response.cookie("authorization", token);
    } catch {
      response.unauthorized("Invalid credentials");
    }
  }

  public logout({ response }: HttpContextContract) {
    response.cookie("authorization", "", {
      maxAge: 0,
    });

    return "Sucessfully logged out";
  }
}
