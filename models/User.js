class User {
    constructor(id, role_id, login, password) {
        this.id = id;
        this.role_id = role_id;
        this.login = login;
        this.password = password;
    }
}

module.exports = {
  User: User
}