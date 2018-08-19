'user strict';

const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const { Author, BlogPost } = require('./models');

router.get('/', (req, res) => {
    BlogPost.findOne({
        title: "10 things -- you won't believe #4"
    })
    .then( blogPost => {
        let test = blogPost.serialize();
        res.json({test})
    })
    .catch(err =>{
      console.log(err);
      res.status(500).json({message:"Internal server error"});
    });
});
router.get('/:id', (req, res) =>{
    BlogPost.findOne({
        _id: req.params.id
    }).then( postComment =>{
        postComment.comments.push({ content: 'a comment positive comment' });
        postComment.save();
        res.json({postComment});
    })
});

router.post('/authors', jsonParser, (req, res) =>{
    const requiredFields = ["firstName", "lastName", "userName"];
    requiredFields.forEach(field => {
        if(!(field in req.body)){
            const message = `Missing \`${field}\` in request body`;
            console.log(message);
            return res.status(400).send(message);
        }
    });
    Author
      .create({
          "firstName": req.body.firstName,
          "lastName": req.body.lastName,
          "userName": req.body.userName
      })
      .then(author => {
        BlogPost
         .create({
             "title": "another title",
             "content": " a bunch more amazing words",
             "author": author._id
         })
        }).then(
            BlogPost.findOne({
                _id: req.params.id
            })
          )
          .catch(err =>{
            console.log(err);
            res.status(500).json({message:"Internal server error"});
          });
});

router.put('/authors/:id', jsonParser, (req, res) => {
    Author
        .updateOne(
            {_id: req.params.id},
            {
                "firstName": req.body.firstName,
                "lastName":  req.body.lastName,
                "userName": req.body.userName
            })
            .then(
                BlogPost.findOne({
                    _id: req.params.id
                })
              )
              .then(message => {res.status(204).end()})
              .catch(err =>{
                console.log(err);
                res.status(500).json({message:"Internal server error"});
              });
});

router.delete('/authors/:id', (req, res) => {
    console.log("Arrived at Delete")
    Author
        .findOneAndDelete({_id: req.params.id})
        .then(deletion => res.status(204).end())
        .catch(err => res.status(500).json({message: "Internal server error"}))
        
});



module.exports = router;