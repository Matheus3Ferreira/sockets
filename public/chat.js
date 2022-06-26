const socket = io();

const urlSearch = new URLSearchParams(window.location.search);
const username = urlSearch.get("username");
const room = urlSearch.get("selected_room");

//emit => emite informação.
//on => escutando alguma informação.

const userDataDiv = document.getElementById("user-data");
userDataDiv.innerHTML = `Olá ${username} - Você está na sala ${room}`

socket.emit("select_room", {
    username,
    room
}, messages => {
    messages.forEach(message => createMessage(message));
});

document.getElementById("send-message").addEventListener("keypress", (event) => {
    if(event.key == "Enter"){
        const message = event.target.value;

        const data = {
            username,
            room,
            message
        }

        socket.emit("sendMessage", data);
        
        event.target.value = "";
    }
});

socket.on("sendMessage", (data) => {
    createMessage(data);
});

function createMessage(data) {
    const messageDiv = document.getElementById("message");

    messageDiv.innerHTML += `
    <div class="message">
        <strong>${data.username}</strong>
        <span>${data.message} - ${dayjs(data.created_at).format("DD/MM HH:mm")}</span>
    </div>
    `
}

document.getElementById("logout").addEventListener("click", (event) => {
    window.location.href="index.html";
})
