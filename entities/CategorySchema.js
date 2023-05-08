const EntitySchema = require("typeorm").EntitySchema;
const Category = require("../models/Category").Category;

module.exports = new EntitySchema({
  name: "Category",
  tableName: "categories",
  target: Category,
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
      default: "New Category"
    },
  },
  relations: {
    users: {
      name: 'users',
      target: 'User',
      type: 'many-to-many',
      joinTable: {
        name: 'user_category',
        joinColumn: {
          name: 'category_id',
          referencedColumnName: 'id'
        },
        inverseJoinColumn: {
          name: 'user_id',
          referencedColumnName: 'id'
        }
      },
      inverseSide: 'category',
    },
    post: {
      type: 'one-to-many',
      target: 'Post',
      inverseSide: 'categories',
    },
  }
});