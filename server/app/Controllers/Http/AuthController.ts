import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import Hash from "@ioc:Adonis/Core/Hash";
import Mail from "@ioc:Adonis/Addons/Mail";

import Routes from "@ioc:Adonis/Core/Route";

import User from "App/Models/User";

import ForgotPasswordEmailValidator from "App/Validators/ForgotPasswordEmailValidator";
import ChangePasswordValidator from "App/Validators/ChangePasswordValidator";

export default class AuthController {
  public async login({ auth, request, response }: HttpContextContract) {
    const encodedCredentilas = request.header("authorization") ?? "";

    const decodeCredentilas = (credentials: string) => {
      const decode = Buffer.from(credentials.split(" ")[1], "base64").toString("utf-8");

      const [email, password] = decode.split(":");

      return { email, password };
    };

    const { email, password } = decodeCredentilas(encodedCredentilas);

    try {
      const user = await User.query().where("email", email).firstOrFail();

      if (!(await Hash.use("bcrypt").verify(user.password, password))) {
        return response.unauthorized("Invalid credentials");
      }

      // Verify if e-mail user is verified
      if (!user.verified) {
        const signedUrl = Routes.builder()
          .prefixUrl(`${request.secure() ? "https://" : "http://"}${request.host()}`)
          .params({ email: user.email })
          .makeSigned("verifyEmail", { expiresIn: "30m" });

        await Mail.send((message) => {
          message
            .from("Gallery Online<bryangomesrocha@gmail.com>")
            .to(user.email)
            .subject("Confirm your e-mail.")
            .htmlView("emails/verify_email", { name: user.name, url: signedUrl });
        });

        return response.unauthorized("Need confirm e-mail");
      }

      const token = await auth.use("jwt").generate(user);

      response.ok({
        type: token.type,
        token: token.accessToken,
        expiresAt: token.expiresAt,
      });

      response.cookie("authorization", token);
    } catch (error) {
      console.log(error);
      response.unauthorized("Invalid credentials");
    }
  }

  public logout({ response }: HttpContextContract) {
    response.cookie("authorization", "", {
      maxAge: 0,
    });

    return "Sucessfully logged out";
  }

  public async verifyEmail({ request, response, view }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.badRequest("Signature is missing or URL was tampered.");
    }

    try {
      await User.query().where("email", request.param("email")).update({ verified: true });

      return view.render("auth/verified");
    } catch {
      return "Error on verify";
    }
  }

  public async forgotPasswordEmail({ request, response }: HttpContextContract) {
    const { email } = (await request.validate(ForgotPasswordEmailValidator)).params;

    try {
      const user = await User.findByOrFail("email", email);

      const signedUrl = Routes.builder()
        .prefixUrl(`${request.secure() ? "https://" : "http://"}${request.host()}`)
        .params({ email: user.email })
        .makeSigned("forgotPassword", { expiresIn: "10m" });

      Mail.send((message) => {
        message
          .from("Gallery Online<bryangomesrocha@gmail.com>")
          .to(user.email)
          .subject("Forgot Password")
          .htmlView("emails/forgot_password_email", { name: user.name, url: signedUrl });
      });

      return "Password update request sent to user e-mail";
    } catch (error) {
      console.log(error);
      response.badRequest("User does not exists");
    }
  }

  public async renderForgotPasswordPage({ view, request, response }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return response.badRequest("Signature is missing or URL was tampered.");
    }

    const email = request.param("email");

    const signedUrl = Routes.builder()
      .prefixUrl(`${request.secure() ? "https://" : "http://"}${request.host()}`)
      .params({ email })
      .makeSigned("changePassword", { expiresIn: "10m" });

    return view.render("auth/forgot_password", { email, url: signedUrl });
  }

  public async changePassword({ request, view }: HttpContextContract) {
    if (!request.hasValidSignature()) {
      return "Action expired.";
    }

    const email = request.param("email");
    const password = (await request.validate(ChangePasswordValidator)).password;

    try {
      await User.query()
        .where({ email: email })
        .update("password", await Hash.use("bcrypt").make(password));

      return view.render("auth/password_changed");
    } catch (error) {
      return error;
    }
  }
}
