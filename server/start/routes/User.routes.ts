import Routes from "@ioc:Adonis/Core/Route";

Routes.group(() => {
  Routes.post("/", "UsersController.create");
  Routes.get("/:id/:email", "UsersController.confirmEmailForUpdate").as("confirmEmailUpdate");
}).prefix("/user");

Routes.group(() => {
  Routes.get("/", "UsersController.index");
  Routes.patch("/", "UsersController.update");
  Routes.delete("/", "UsersController.delete");
})
  .prefix("/user")
  .middleware("auth");
