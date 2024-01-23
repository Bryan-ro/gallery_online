import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

import User from "App/Models/User";
import CreateUser from "App/Validators/CreateUserValidator";

export default class UsersController {
  public async index() {
    return "foi";
  }

  public async create({ request, response }: HttpContextContract) {
    const user = await request.validate(CreateUser);

    await User.create(user);

    return response.created({
      message: "User successfully created",
    });
  }
}
