import BaseSeeder from "@ioc:Adonis/Lucid/Seeder";

import User from "App/Models/User";

export default class extends BaseSeeder {
  public async run() {
    await User.query().delete();

    await User.createMany([
      {
        name: "Luis Carlos",
        email: "luiscarlos@gmail.com",
        password: "390190cjkhskdj",
        verified: true,
      },
      {
        name: "Valéria Pereira",
        email: "valeria.pereira@outlook.com",
        password: "dfssdahjfkh1298",
        verified: true,
      },
      {
        name: "Dorival dos Santos",
        email: "dorival@hotmail.com",
        password: "1jhnfdash812",
        verified: true,
      },
    ]);
  }
}
