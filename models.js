'use strict';

const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const authorSchema = mongoose.Schema({
    firstName: 'string',
    lastName: 'string',
    userName: {
      type: 'string',
      unique: true
    }
  });
  
const commentSchema = mongoose.Schema({ content: 'string' });
  
const blogPostSchema = mongoose.Schema({
    title: 'string',
    content: 'string',
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'Author' },
    comments: [commentSchema]
});

blogPostSchema.pre('findOne', function(next) {
    console.log("AAAAAAAHHHHH")
    this.populate('author');
    next();
  });

blogPostSchema.virtual("authorName").get(function(){
    console.log("BBBAAAAAAHHHH")
    return `${this.author.firstName} ${this.author.lastName}`.trim();
});

blogPostSchema.methods.serialize = function(){
    console.log(this);
    return{
        id: this._id,
        title: this.title,
        content: this.content,
        author: this.authorName
    };
};

const Author = mongoose.model('Author', authorSchema);
const BlogPost = mongoose.model('BlogPost', blogPostSchema);

module.exports = { Author,  BlogPost };