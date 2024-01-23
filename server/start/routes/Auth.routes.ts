import Routes from "@ioc:Adonis/Core/Route";

Routes.group(() => {
  Routes.post("/login", "AuthController.login");
  Routes.post("/logout", "AuthController.logout");
}).prefix("/auth");
