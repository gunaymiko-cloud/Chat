let socket;
let currentUser = '';

function joinChat() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username === '') {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    currentUser = username;
    
    // Имитация WebSocket соединения (в реальном проекте используй WebSocket)
    socket = {
        send: function(data) {
            console.log('Отправлено:', data);
            // Здесь будет реальная отправка на сервер
            simulateMessageReceiving(data);
        }
    };
    
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('chatMain').style.display = 'flex';
    
    // Добавляем приветственное сообщение
    addSystemMessage(`Добро пожаловать в чат, ${username}!`);
    
    // Обновляем список пользователей
    updateOnlineUsers();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    const message = messageInput.value.trim();
    
    if (message === '') return;
    
    const messageData = {
        type: 'message',
        user: currentUser,
        text: message,
        time: new Date().toLocaleTimeString()
    };
    
    // Отправляем сообщение
    socket.send(JSON.stringify(messageData));
    
    // Добавляем своё сообщение в чат
    addMessage(currentUser, message, true);
    
    messageInput.value = '';
}

function addMessage(user, text, isOwn = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    
    if (isOwn) {
        messageElement.style.background = '#e6fffa';
    }
    
    messageElement.innerHTML = `
        <div class="message-sender">
            ${user} <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-text">${text}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addSystemMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message';
    messageElement.style.background = '#fffaf0';
    messageElement.style.textAlign = 'center';
    messageElement.style.color = '#d69e2e';
    messageElement.innerHTML = `<em>${text}</em>`;
    
    messagesContainer.appendChild(messageElement);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateOnlineUsers() {
    const usersList = document.getElementById('usersList');
    const onlineCount = document.getElementById('onlineCount');
    
    // Имитация списка пользователей
    const users = [currentUser, 'Друг_1', 'Друг_2', 'Подруга_1'];
    
    usersList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = 'user-item';
        userElement.textContent = user === currentUser ? `👑 ${user} (Вы)` : `👤 ${user}`;
        usersList.appendChild(userElement);
    });
    
    onlineCount.textContent = users.length;
}

// Имитация получения сообщений от других пользователей
function simulateMessageReceiving(data) {
    const messageData = JSON.parse(data);
    
    // Имитируем ответы друзей через случайное время
    if (messageData.type === 'message') {
        setTimeout(() => {
            const responses = [
                'Привет! Как дела?',
                'Отличная идея!',
                'Я тоже тут)',
                'Что нового?',
                'Давай обсудим это'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const randomUser = ['Друг_1', 'Друг_2', 'Подруга_1'][Math.floor(Math.random() * 3)];
            
            addMessage(randomUser, randomResponse);
        }, 1000 + Math.random() * 3000);
    }
}

// Обработка нажатия Enter в поле ввода
document.getElementById('messageInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

document.getElementById('usernameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        joinChat();
    }
});
