const express = require('express');
const router = express.Router();

const authUser = require('../middleware/auth.middleware');
const {createChat, getChats, getMessages} =  require('../controllers/chat.controller');

// POST -> /api/chat/ -> in this url, user will create their chats
router.post('/', authUser, createChat );  // when user is logged in, only when chat can be created - middleware

// get -> /api/chat  - in this url, user will get all their chats
router.get('/', authUser, getChats);

//GET - /api/chat/messages/:id - specific chat by id 
router.get('/messages/:id', authUser, getMessages);

module.exports = router;