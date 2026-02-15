const chatModel = require('../models/chat.model');
const messageModel = require('../models/message.model');


async function createChat(req, res) {

    const {title} = req.body;
    const user = req.user;

    const chat = await chatModel.create({
        user: user._id,
        title
    });

    res.status(201).json({
        message: "Chat created successfully",
        chat: {
            _id: chat._id,
            title: chat.title,
            lastActivity: chat.lastActivity,
            // user: chat.user
        }
    });
}

async function getChats(req, res){
    const user = req.user;
    const chats = await chatModel.find({user: user._id});
    res.status(200).json({
        message: "Chats fetched successfully",
        chats: chats.map(chat => ({
            id: chat._id,
            title: chat.title,
            user: chat.user,
            lastActivity: chat.lastActivity
        }))
    });

}

async function getMessages(req, res){
    // console.log(req.params.id);
    const chatId = req.params.id;
    const messages = await messageModel.find({chat: chatId}).sort({createAt: 1});
    res.status(200).json({
        msg: 'msg receives',
        messages: messages
    })
}

module.exports ={ createChat, getChats, getMessages}
