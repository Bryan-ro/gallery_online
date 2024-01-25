import Routes from "@ioc:Adonis/Core/Route";

Routes.group(() => {
  Routes.post("/login", "AuthController.login");
  Routes.post("/logout", "AuthController.logout").middleware("auth");
  Routes.get("/verify/:email", "AuthController.verifyEmail").as("verifyEmail");
  Routes.post("/forgot-password/:email", "AuthController.forgotPasswordEmail");
  Routes.get("/update-password/:email", "AuthController.renderForgotPasswordPage").as("forgotPassword");
  Routes.post("password-changed/:email", "AuthController.changePassword").as("changePassword");
}).prefix("/auth");
