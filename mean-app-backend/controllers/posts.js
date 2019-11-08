const Post = require("../models/post");
const io = require('../socket.js')

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.current;
  const postFindQuery = Post.find();
  let posts;

  if(pageSize!==undefined &&  currentPage!==undefined){
    postFindQuery
      .skip((currentPage-1) * pageSize)
      .limit(pageSize);
  }
  postFindQuery
    .then(
      postsDocuments=>{
        posts = postsDocuments;
        return Post.countDocuments();
      }
    )
    .then(count=>{
        res.status(200).json({
          message: "SUCCESS: POSTS RETRIEVED!",
          posts: posts.map(p=>{
            return {
              id:p._id,
              title:p.title,
              content:p.content,
              imagePath:p.imagePath,
              creator:p.creator
            }
          }),
          count: count
        });
    })
    .catch((err) => {
      res.status(500);
      next(err);
    });


}

exports.addPost = (req, res, next) => {
  const title = req.body.title;
  const content = req.body.content;
  const url = req.protocol + '://' + req.get('host');
  const message = '';
  const status = 500;
  const creator = res.userData.id;

  const newPost = new Post({
    title: title,
    content: content,
    imagePath: url + "/images/" + req.file.filename,
    creator: creator
  });

  newPost.save()
  .then(post=>{
    Post.countDocuments()
      .then(count=>{
        //SOCKET=======================================================================
        const socketPost = {
          id:post._id,
          title:post.title,
          content:post.content,
          imagePath:post.imagePath,
          creator:post.creator
        }
        io.getIO().emit('posts', { action: 'create', post: socketPost, count: count})
        //SOCKET=======================================================================

        this.message = "SUCCESS: RESOURCE CREATED - (POST ADDED)";
        this.status = 201;
        res.status(this.status).json({
          id: newPost._id,
          imagePath: newPost.imagePath,
          message: this.message,
          count: count
        });
      })
    })
  .catch((err) => {
    res.status(500)
    next(err);
  });

}

exports.editPost = (req, res, next) => {
  const id = req.body.id;
  const title = req.body.title;
  const content = req.body.content;
  const creator = res.userData.id;
  let imagePath;

  if(req.file!==undefined){
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + "/images/" + req.file.filename;
  }

  if(req.file===undefined){
    imagePath = req.body.imagePath;
  }

  Post.findOneAndUpdate({_id:id, creator:creator}, { title: title, content: content, imagePath:imagePath })
    .then(opRes => {
      if(opRes!==null){
        //SOCKET===============================================================
        const socketPost = {
          id:opRes._id,
          title: title,
          content: content,
          imagePath: imagePath,
          creator: creator
        }
        console.log(socketPost.title);
        io.getIO().emit('posts', { action: 'update', post: socketPost, count: null});
        //SOCKET===============================================================
        res.status(200).json({
          message: `SUCCESS: RESOURCE EDITED - (SUCCESS: POST (${id} UPDATED!)`,
          imagePath: imagePath
        });
      }
      else{
        res.status(401).json({
          message:"Unauthorized!"
        })
      }
    })
    .catch((err) => {
      res.status(500);
      next(err);
    });
}

exports.deletePost = (req, res, next) => {
  const id = req.params.id;
  const creator = res.userData.id;

  console.log(id);
  console.log(creator);


  Post.findOneAndDelete({_id:id, creator: creator})
    .then(opRes=>{
      if(opRes!==null){
        Post.countDocuments()
          .then(count=>{
            //SOCKET===============================================================
            const socketPost = {
              id:opRes._id,
              title:opRes.title,
              content:opRes.content,
              imagePath:opRes.imagePath,
              creator:opRes.creator
            }
            io.getIO().emit('posts', { action: 'delete', post: socketPost, count: count});
            //SOCKET===============================================================
            res.status(200).json({
              message: "SUCCESS: POST DELETED!",
              count:count
            })
          })
          .catch((err) => {
            res.status(500);
            next(err);
          })
      }
      else {
        res.status(401).json({
          message:"UNAUTORIZED!"
        });
      }
    })
    .catch(err=>{
      res.status(500);
      next(err);
    });
}

exports.getPost = (req, res, next) => {
  const id = req.params.id;
  Post.findById(id)
    .then(post=>{
        res.status(200).json({
          message:`(200) SUCCESS: POST ${post._id} RETRIEVED!`,
          post: post
        });
      })
    .catch((err) => {
      res.status = 404;
      err.message = `(404) ERROR: CANNOT FIND POST WITH ID: ${id}!`
      return next(err);
    })
}
