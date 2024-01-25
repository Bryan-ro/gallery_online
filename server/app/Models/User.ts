import { DateTime } from "luxon";
import { BaseModel, beforeSave, column, hasMany, HasMany } from "@ioc:Adonis/Lucid/Orm";

import { v4 as uuidv4 } from "uuid";

import Hash from "@ioc:Adonis/Core/Hash";

import Gallery from "App/Models/Gallery";

export default class User extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public name: string;

  @column()
  public email: string;

  @column()
  public password: string;

  @column()
  public verified: boolean;

  @hasMany(() => Gallery)
  public images: HasMany<typeof Gallery>;

  @beforeSave()
  public static async autoId(user: User) {
    user.id = uuidv4();
  }

  @beforeSave()
  public static async hashPassword(user: User) {
    if (user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

  @beforeSave()
  public static async verifiedFalse(user: User) {
    user.verified = false;
  }

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;
}
