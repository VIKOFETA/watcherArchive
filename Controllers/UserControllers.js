const User = require('../models/User').User
const Role = require('../models/Role').Role
const connection = require('../db')

exports.getAll = async (req, res) => {
  try {
    const response = await connection
      .getRepository(User)
      .find({ relations: { role: true } } );
    return res.send(response);
  } catch(e) {
    console.log(e);
    return res.status(500).json(e);
  }
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id) {
      return res.status(400).json({'message': 'Id is not find, please add id.'})
    }

    const response = await connection.getRepository(User).findOne({ where: { id: id }, relations: { role: true } });
    return res.send(response);
  } catch(e) {
    return res.status(500).json(e);
  }
};
exports.create = async (req, res) => {
  if(!req.body) return res.sendStatus(400).json({message: 'User info required'});
  try{
    const { login, password, role } = req.body;

    const tempUser = await connection.getRepository(User).findOneBy({login: login});
    if(tempUser) {
      return res.status(400).json({ message: 'User login already exists', login: login});
    }

    const userRole = await connection.getRepository(Role).findOneBy({name: role});
    if(!userRole){
      return res.status(400).json({ message: 'Role not found', role: role});
    }

    const user = connection.getRepository(User).create({ login: login, role: userRole, password: password});
    const response = await connection.getRepository(User).save(user);
    return res.json({message: 'User added successfully', response: response });

  } catch(e) {
    return res.status(500).json(e);
  }
};
exports.delete = async (req, res) => {
  if(!req.params) return res.sendStatus(400).json({message: 'User info required'});
  try {
    const { id } = req.params;
    if(!id) {
      return res.status(400).json({message: 'Id is not find, please add id.'})
    }
    const response = await connection.getRepository(User).delete(id);  
    return res.status(200).json({id: id, message: 'User Successfuly deleted', response: response})
  } catch(e) {
    return res.status(500).json(e);
  }
};
exports.setRole = async (req, res) => {
  try {
    const { login, role } = req.body;
    if(!login || !role) {
      return res.status(400).json({message: 'Login or role is not indicated.'})
    }
    const user = await connection.getRepository(User).findOneBy({login: login});
    if (!user) {      
      return res.status(400).json({message: `User ${login}, not found`})
    }
    const roleObj = await connection.getRepository(Role).findOneBy({name: role});
    if (!roleObj) {      
      return res.status(400).json({message: `Role ${role}, not found`})
    }

    user.role = roleObj;
    const response = await connection.getRepository(User).save(user);

    return res.status(200).json({message: `Role ${role} was set for ${login}`, response: response});
  } catch(e) {
    return res.status(500).json(e);
  }
};