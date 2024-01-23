import Routes from "@ioc:Adonis/Core/Route";

Routes.group(() => {
  Routes.post("/", "UsersController.create");
}).prefix("/user");

Routes.group(() => {
  Routes.get("/", "UsersController.index");
})
  .prefix("/user")
  .middleware("auth");
