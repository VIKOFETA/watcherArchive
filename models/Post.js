class Post {
  constructor(id, title, interaction_date, description, rating, count, image) {
      this.id = id;
      this.title = title;
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