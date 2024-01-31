import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";

export default class Auth {
  public async handle({ auth, request, response }: HttpContextContract, next: () => Promise<void>) {
    try {
      let token = request.cookie("authorization").token;
      request.headers()["authorization"] = `Bearer ${token}`;

      await auth.use("jwt").check();

      return next();
    } catch {
      return response.unauthorized("Not logged in");
    }
  }
}
