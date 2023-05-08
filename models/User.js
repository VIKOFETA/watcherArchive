class User {
    constructor(id, role_id, login, password, categories) {
        this.id = id;
        this.role_id = role_id;
        this.login = login;
        this.password = password;
        this.categories = categories;
    }
}

module.exports = {
  User: User
}