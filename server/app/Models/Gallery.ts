import { DateTime } from "luxon";
import { BaseModel, beforeSave, column } from "@ioc:Adonis/Lucid/Orm";

import { v4 as uuidv4 } from "uuid";

export default class Gallery extends BaseModel {
  @column({ isPrimary: true })
  public id: string;

  @column()
  public image: string;

  @column()
  public user_id: string;

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime;

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime;

  @beforeSave()
  public static async autoId(gallery: Gallery) {
    gallery.id = uuidv4();
  }
}
