const User = require('../models/User').User
const Role = require('../models/Role').Role
const connection = require('../db')
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtKey } = require('../config');
const { validationResult } = require('express-validator');

const generateToken = async (user) => {
  const info = {
    user,
  }

  return jwt.sign(info, jwtKey, { expiresIn: '24h' });
};

exports.login = async (req, res) => {
  try {
    const { login, password } = req.body;

    // check for existed login
    const user = await connection.getRepository(User).findOne({where: { login: login}, relations: { role: true } } );
    if(!user) {
      res.status(400).json({ message: `User ${login} not exist`, login: login});
    }

    const validPass = bcrypt.compareSync(password, user.password);
    if(!validPass) {
      res.status(400).json({ message: 'Password is incorrect' });
    }

    const token = await generateToken(user);

    return res.status(200).json({token: token, user: user});

  } catch(e) {
    res.status(500).json({ message: 'Registration error', error: e });
  }
};

exports.registration = async (req, res) => {
  try{
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ message: 'Registartion validation error', errors: errors });
    }

    const { login, password } = req.body;

    // check for existed login
    const tempUser = await connection.getRepository(User).findOneBy({login: login});
    if(tempUser) {
      res.status(400).json({ message: 'User login already exists', login: login});
    }

    //get hash password
    const hashPass = bcrypt.hashSync(password, 5);
    //get role - USER
    const userRole = await connection.getRepository(Role).findOneBy({name: "USER"});

    //create User
    const user = connection.getRepository(User).create({ login: login, role: userRole, password: hashPass});
    const response = await connection.getRepository(User).save(user);
    // successfull response
    return res.json({message: 'User added successfully', user: response });
  } catch(e) {
    console.log(e);
    res.status(500).json({message: 'Registration error', error: e});
  }
};
