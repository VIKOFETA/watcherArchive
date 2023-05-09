const User = require('../models/User').User
const Post = require('../models/Post').Post
const path = require('path');
const connection = require('../db')
const fs = require('fs');

exports.getAll = async (req, res) => {
  // if(!req.body) return res.status(400).json({message: 'Data required'});
  try {    
    const where = { user_id: req.user.id };
    if(req.body.category) {
      where.category_id = req.body.category;
    }    
    const posts = await connection.getRepository(Post).find({
        ...where,
        order: {
          interaction_date: "DESC"
        }
      }
    );

    res.json({posts: posts});
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
  }
};
exports.getOne = async (req, res) => {
  try {
    const { id } = req.params;
    if(!id) {
      res.status(400).json({message: 'Id is not find, please add id.'})
    }

    const where = { user_id: req.user.id, id: id };
    if(req.body.category) {
      where.category_id = req.body.category;
    }    
    const post = await connection.getRepository(Post).findOne({
        ...where,
      }
    );
    res.send(post);
  } catch(e) {
    res.status(500).json(e);
  }
};
exports.create = async (req, res) => {
  try{
    // check for must params
    if(!req.body.category) return res.status(400).json({message: 'Category id required'});
    if(!req.body.title) return res.status(400).json({message: 'Title required'});

    const { title, category, description, rating } = req.body;

    // if user has such category
    const user = await connection.getRepository(User).findOne({
      where: { id: req.user.id },
      relations: { categories: true }
    });
    const categoryObj = user.categories.filter(el=>{ return el.id == category; });
    if(categoryObj == 0) return res.status(400).json({message: 'User has no such category'});

    // create params for post
    const newPostParams = { 
      title: title || 'Some title', 
      description: description || 'EMPTY',
      user_id: user.id,
      category_id: category,
      rating: rating || 0,
      count: 1,
      image: "",
    }

    // if file in body
    const files = req.files;
    if(files) {
      const firstFile = files[Object.keys(files)[0]];
      const filePath = path.join('./public/assets/images', firstFile.name);
      firstFile.mv(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({message: "file save error", error: err });
        }
      });

      newPostParams.image = filePath
    }

    // create post
    const post = await connection.getRepository(Post).create(newPostParams);
    const response = await connection.getRepository(Post).save(post);

    res.json({message: 'Post added successfully', response: response });
  } catch(e) {
    console.log('error', e)
    res.status(500).json(e);
  }
};
exports.delete = async (req, res) => {
  if(!req.params.id) return res.status(400).json({message: 'Id is not find, please add id.'});
  try {
    const { id } = req.params;

    const post = await connection.getRepository(Post).findOne({ where: {user_id: req.user.id, id: id } });

    if(post.image){
      fs.unlink(post.image, (err) => {
        if (err) {
          console.error(err);
          return;
        }
      });
    }

    const result = await connection.getRepository(Post).delete({
      user_id: req.user.id,
      id: id
    });
    res.status(400).json({message: 'Successfuly deleted', response: result});

  } catch(e) {
    res.status(500).json(e);
  }
};
exports.change = async (req, res) => {
  if(!req.body.id) return res.status(400).json({message: 'Id is not find, please add id.'});
  try {
    const { id, title, description, count, rating,  } = req.body;

    let post = await connection.getRepository(Post).findOne({ where: {user_id: req.user.id, id: id } });

    if(!post) {
      res.status(400).json({message: 'No such post'});
    }

    const newParams = {};

    if(title)       { newParams.title = title; }
    if(description) { newParams.description = description; }
    if(count)       { newParams.count = count; }
    if(rating)      { newParams.rating = rating; }

    const files = req.files;
    if(files) {
      if(post.image){
        fs.unlink(post.image, (err) => {
          if (err) {
            console.error(err);
            return;
          }
        });
      }

      const firstFile = files[Object.keys(files)[0]];
      const filePath = path.join('./public/assets/images', firstFile.name);
      firstFile.mv(filePath, (err) => {
        if (err) {
          console.log(err);
          res.status(400).json({message: "file save error", error: err });
        }
      });

      newParams.image = filePath
    }

    if(Object.keys(newParams).length === 0) {
      res.status(400).json({message: 'Nothing to change'});
    }

    await connection.getRepository(Post)
      .update(id, { ...newParams, interaction_date: new Date() });
    
    post = await connection.getRepository(Post).findOne({ where: {user_id: req.user.id, id: id } });

    res.status(200).json({message: "Post changed", post: post})
  } catch(e) {
    console.log(e);
    res.status(500).json(e);
  }
};