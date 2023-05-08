const EntitySchema = require("typeorm").EntitySchema;
const User = require("../models/User").User;
const Role = require("../models/Role").Role;
const Category = require("../models/Category").Category;

module.exports = new EntitySchema({
  name: "User",
  tableName: "users",
  target: User,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    // role_id: {
    //   type: "int",
    //   nullable: false,
    //   index: true
    // },
    login: {
      type: "varchar",
      nullable: false,
      unique: true,
    },
    password: {
      type: "text",
      nullable: false,
    }
  },
  relations: {
    // role: {
    //   target: "Role",
    //   type: "one-to-many",
    //   joinColumn: {
    //     name: "role_id",
    //   },
    //   inverseSide: 'users',
    // },
    role: {
      type: 'many-to-one',
      target: 'Role',
      joinColumn: {
        name: 'role_id',
      },
    },
    categories: {
      name: 'categories',
      target: 'Category',
      type: 'many-to-many',
      joinTable: {
        name: 'user_category',
        joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'category_id',
          referencedColumnName: 'id'
        }
      },
      inverseSide: 'users',
    }
  }
});