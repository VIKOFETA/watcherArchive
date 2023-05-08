class Post {
  constructor(id, title, interaction_date, catergory_id, user_id, description, rating, count, image) {
      this.id = id;
      this.title = title;
      this.user_id = user_id;
      this.catergory_id = catergory_id;
      this.interaction_date = interaction_date;
      this.description = description;
      this.rating = rating;
      this.count = count;
      this.image = image;
  }
}

module.exports = {
  Post: Post
}