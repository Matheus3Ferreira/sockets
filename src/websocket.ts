import {io} from "./http";

interface IRoomUser {
    socket_id: string;
    username: string;
    room: string;
}

interface IMessage {
    username: string;
    room: string;
    message: string;
    created_at: Date;
}

const users: IRoomUser[] = [];

const messages: IMessage[] = [];

io.on("connection", socket => { //Sempre que o cliente se conectar ao servidor, é gerado um socket.
    
    socket.on("select_room", ({username, room}, callback) => {

        socket.join(room);

        const userInRoom = users.find(user => username === user.username && user.room === room);

        if (userInRoom) {
            userInRoom.socket_id = socket.id;
        } else {
            users.push({
                room: room,
                socket_id: socket.id,
                username: username,
            });
        }

        const messagesRoom = getMessagesRoom(room);
        callback(messagesRoom);
    });

    socket.on("sendMessage", (data) => {

        const newMessage: IMessage = {
            username: data.username,
            room: data.room,
            message: data.message,
            created_at: new Date(),
        };

        messages.push(newMessage);

        //Se for enviar a mensagem para todos da sala, utiliza-se o io.
        //Se for enviar a mensagem somente para o usuário, utiliza-se o socket.
        io.to(data.room).emit("sendMessage", newMessage)

    });

});

function getMessagesRoom(room: string) {
    const messagesRoom = messages.filter(message => message.room === room);
    return messagesRoom;
}