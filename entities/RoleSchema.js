const EntitySchema = require("typeorm").EntitySchema;
const Role = require("../models/Role").Role;

module.exports = new EntitySchema({
  name: "Role",
  tableName: "roles",
  target: Role,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    name: {
      type: "varchar",
      nullable: false,
      unique: true,
      default: "USER"
    },
  }
});