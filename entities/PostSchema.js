const EntitySchema = require("typeorm").EntitySchema;
const User = require("../models/User").User;
const Post = require("../models/Post").Post;
const Category = require("../models/Category").Category;

module.exports = new EntitySchema({
  name: "Post",
  tableName: "posts",
  target: Post,
  columns: {
    id: {
      primary: true,
      type: "int",
      generated: true
    },
    title: {
      type: "varchar",
      nullable: false,
    },
    user_id: {
      type: "int",
      nullable: false,
      index: true
    },
    category_id: {
      type: "int",
      nullable: false,
      index: true
    },
    interaction_date: {
      type: "datetime",
      nullable: false,
      default: () => 'CURRENT_TIMESTAMP'
    },
    description: {
      type: "text",
    },
    rating: {
      type: "int",
      default: 0,
    },
    count: {
      type: "int",
      default: 0,
    },
    image: {
      type: "varchar",
    }

  },
  relations: {
    user_id: {
      target: "User",
      type: "one-to-many",
      joinColumn: {
        name: 'user_id',
        joinColumn: {
          name: 'user_id',
          referencedColumnName: 'id'
        },
      },
      cascade: true
    },
    category_id: {
      target: 'Category',
      type: 'one-to-many',
      joinTable: {
        name: 'category_id',
        joinColumn: {
          name: 'category_id',
          referencedColumnName: 'id'
        },
      },
      cascade: true
    }
  }
});