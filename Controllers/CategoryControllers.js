const User = require('../models/User').User
const Category = require('../models/Category').Category
const connection = require('../db')

exports.getAll = async (req, res) => {
  try {
    const user = await connection.getRepository(User).findOne({
        where: {
          id: req.user.id
        },
        relations: {
          categories: true
        }
      }
    );
    const categories = user.categories;
    return res.json({categories: categories});
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

    const user = await connection.getRepository(User).findOne({
      where: {
        id: req.user.id
      },
      relations: {
        categories: true
      }
    }
  );
  const category = user.categories.filter(el=>{ return el.id == id; });
  return res.send(category);
  } catch(e) {
    return res.status(500).json(e);
  }
};
exports.create = async (req, res) => {
  if(!req.body.name) return res.sendStatus(400).json({message: 'Category name required'});
  try{
    const { name } = req.body;

    const user = await connection.getRepository(User).findOne({
        where: {
          id: req.user.id
        },
        relations: {
          categories: true
        }
      }
    );
    const tempCategory = await connection.getRepository(Category).findOneBy({name: name});
    if(tempCategory){
      user.categories.push(tempCategory)
      await connection.getRepository(User).save(user);
      res.status(200).json({ message: 'Category added successfully', category: tempCategory});
    }
    const category = await connection.getRepository(Category).create({ name: name });
    const response = await connection.getRepository(Category).save(category);
    user.categories.push(category);
    await connection.getRepository(User).save(user);
    return res.json({message: 'Category added successfully', response: response });
  } catch(e) {
    console.log('error', e)
    return res.status(500).json(e);
  }
};
exports.delete = async (req, res) => {
  if(!req.params.id) return res.sendStatus(400).json({'message': 'Id is not find, please add id.'});
  try {
    const { id } = req.params;
    const user = await connection.getRepository(User).findOne({
      where: {
        id: req.user.id
      },
      relations: {
        categories: true
      }
    }
  );
  if( user.categories.filter(el=>{ return el.id == id; }).length > 0 ) {
    user.categories = user.categories.filter(el=>{ return el.id != id; }); 
    const response = await connection.getRepository(User).save(user);
    return res.status(200).json({id: id, message: 'Category Successfuly deleted', response: response})
  } 
  return res.status(400).json({message: 'No such category'});

  } catch(e) {
    return res.status(500).json(e);
  }
};
exports.change = async (req, res) => {
  if(!req.body) return res.sendStatus(400).json({message: 'Info is not find, please add id and name.'});
  try {
    const { id, name } = req.body;
    const category = await connection.getRepository(Category).findOne({ where: { id: id }, relations: { users: true } });

    if(category.users.filter(user => { return user.id == req.user.id }).length == 0) {
      return res.status(400).json({message: "User has no such category"});  
    }
    
    if(category.users.length == 1) {
      category.name = name;
      const response = await connection.getRepository(Category).save(category);
      return res.status(200).json({message: "Category name changed", category: {id: response.id, name: response.name}});    
    }
    
    const user = await connection.getRepository(User).findOne({where: { id: req.user.id }, relations: { categories: true } });
    user.categories = user.categories.filter(cat => { return cat.id != id });

    const tempCategory = await connection.getRepository(Category).findOne({where: {name: name}});
    if(tempCategory) {
      user.cat.push(tempCategory)
      await connection.getRepository(User).save(user);
      return res.status(200).json({message: "Category name changed", category: { id: tempCategory.id, name: tempCategory.name }})
    } 
    
    
    const newCategory = await connection.getRepository(Category).create({ name: name });
    await connection.getRepository(Category).save(newCategory);
    user.categories.push(newCategory);
    await connection.getRepository(User).save(user);    
    return res.status(200).json({message: "Category name changed", category: newCategory})
    // res.status(200).json({message: "Category change", })
  } catch(e) {
    console.log(e);
    return res.status(500).json(e);
  }
};