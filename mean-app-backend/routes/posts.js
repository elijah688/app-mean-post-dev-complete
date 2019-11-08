const express = require("express");
const router = express.Router();
const guard = require('../middleware/guard')
const postController = require('../controllers/posts')
const readFile = require('../middleware/file')




router.get('', postController.getPosts);

router.post('', guard, readFile, postController.addPost);

router.patch('/edit/:id', guard, readFile, postController.editPost);

router.delete('/delete/:id', guard, postController.deletePost);

router.get(`/edit/:id`, guard, postController.getPost);

module.exports = router;
