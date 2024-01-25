import BaseSchema from "@ioc:Adonis/Lucid/Schema";

export default class JwtTokens extends BaseSchema {
  protected tableName = "jwt_tokens";

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments("id").primary();
      table.uuid("user_id").references("users.id").onDelete("CASCADE").notNullable();
      table.string("name").notNullable();
      table.string("type").notNullable();
      table.string("token", 64).notNullable().unique();
      table.timestamp("expires_at", { useTz: true }).nullable();
      table.timestamp("created_at", { useTz: true }).notNullable();
    });
  }

  public async down() {
    this.schema.dropTable(this.tableName);
  }
}
