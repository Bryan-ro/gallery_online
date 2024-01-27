import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Auth {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    let token = request.cookie("authorization").token;
    request.headers()["authorization"] = `Bearer ${token}`;

    if (!(await auth.use("jwt").check()) || !auth.user?.$attributes.verified) {
      return response.unauthorized("Not logged in");
    }

    return next();
  }
}
