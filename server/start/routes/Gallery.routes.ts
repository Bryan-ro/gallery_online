import Routes from "@ioc:Adonis/Core/Route";

Routes.group(() => {
  Routes.get("/", "GalleryController.index");
  Routes.get("/:imageName", "GalleryController.getOneImage").middleware("auth");
  Routes.post("/", "GalleryController.create");
})
  .prefix("/gallery")
  .middleware("auth");
