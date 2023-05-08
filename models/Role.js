class Role {
  constructor(id, name, users) {
      this.id = id;
      this.name = name;
      this.users = users;
  }
}

module.exports = {
  Role: Role
}