const socketIO = require("socket.io");
const {Network} = require("../models/networkModels");
const {User} = require("../models/networkModels");
const { decrypt } = require("dotenv");

const setupSocketIO = (server) => {
    const io = socketIO(server);

    io.on('connection',async (socket) => {
        console.log('User Connected',socket.id);
        // decrypt message
        const decryptedMessage = decrypt(encryptedMessage.content,encryptedMessage.iv,encryptedMessage.tag,encryptedMessage.temporaryKey);
        const userId = getConnectedUserId(socket);
        io.emit('Online',userId);
        socket.io('chatMessage',async (encryptedMessage) => {
            const sender = await User.findById(encryptedMessage.sender);
            const reciever = await User.findById(encryptedMessage.reciever);
            if(!sender || !reciever){
                return res.json({message : "User is not found."});
            }

            const networkConnection = await Network.findOne({
                "$or" :[
                    {user : encryptedMessage.sender,connection : encryptedMessage.reciever,status : 'accepted'},
                    {user : encryptedMessage.receiver,connection : encryptedMessage.sender,status:'accepted'}
                ]
            })
            if(!neworkConnection){
                return res.json({message : "You both are not following each other."});
            }
            io.to(encryptedMessage.receiver).emit('chatMessage',{
                sender : encryptedMessage.sender,
                content : decryptedMessage
            });
        }); 
        socket.on('disconnect',() => {
            console.log('User disconnected:',socket.id);
            io.emit('Offline',userId);
        });         
    });
    return io;
};

module.exports = setupSocketIO;