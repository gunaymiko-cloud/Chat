let socket;
let currentUser = '';
let isBold = false;

function joinChat() {
    const username = document.getElementById('usernameInput').value.trim();
    
    if (username === '') {
        alert('Пожалуйста, введите ваше имя');
        return;
    }
    
    currentUser = username;
    
    // Имитация WebSocket соединения
    socket = {
        send: function(data) {
            console.log('Отправлено:', data);
            simulateMessageReceiving(data);
        }
    };
    
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('chatMain').style.display = 'flex';
    
    addSystemMessage(`Добро пожаловать в чат, ${username}!`);
    updateOnlineUsers();
    
    // Фокусируемся на поле ввода сообщения
    document.getElementById('messageInput').focus();
}

function sendMessage() {
    const messageInput = document.getElementById('messageInput');
    let message = messageInput.value.trim();
    
    if (message === '') return;
    
    // Применяем форматирование если активно
    if (isBold) {
        message = `**${message}**`;
        isBold = false;
        updateFormattingButton();
    }
    
    const messageData = {
        type: 'message',
        user: currentUser,
        text: message,
        time: new Date().toLocaleTimeString()
    };
    
    socket.send(JSON.stringify(messageData));
    addMessage(currentUser, message, true);
    messageInput.value = '';
    messageInput.style.height = 'auto'; // Сбрасываем высоту
}

function addMessage(user, text, isOwn = false) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = `message ${isOwn ? 'own-message' : 'other-message'}`;
    
    // Обработка форматирования
    let formattedText = text;
    formattedText = formattedText.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    formattedText = formattedText.replace(/:\)/g, '😊');
    formattedText = formattedText.replace(/:\(/g, '😢');
    formattedText = formattedText.replace(/<3/g, '❤️');
    
    messageElement.innerHTML = `
        <div class="message-sender">
            ${isOwn ? 'Вы' : user}
            <span class="message-time">${new Date().toLocaleTimeString()}</span>
        </div>
        <div class="message-text">${formattedText}</div>
    `;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

function addSystemMessage(text) {
    const messagesContainer = document.getElementById('chatMessages');
    const messageElement = document.createElement('div');
    messageElement.className = 'message system-message';
    messageElement.innerHTML = `<em>${text}</em>`;
    
    messagesContainer.appendChild(messageElement);
    scrollToBottom();
}

function scrollToBottom() {
    const messagesContainer = document.getElementById('chatMessages');
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function updateOnlineUsers() {
    const usersList = document.getElementById('usersList');
    const onlineCount = document.getElementById('onlineCount');
    
    const users = [currentUser, 'Максим', 'Саша', 'Маша'];
    
    usersList.innerHTML = '';
    users.forEach(user => {
        const userElement = document.createElement('div');
        userElement.className = `user-item ${user === currentUser ? 'own-user' : ''}`;
        userElement.textContent = user === currentUser ? `${user} (Вы)` : user;
        usersList.appendChild(userElement);
    });
    
    onlineCount.textContent = users.length;
}

function addEmoji(emoji) {
    const messageInput = document.getElementById('messageInput');
    const start = messageInput.selectionStart;
    const end = messageInput.selectionEnd;
    const text = messageInput.value;
    
    messageInput.value = text.substring(0, start) + emoji + text.substring(end);
    messageInput.focus();
    messageInput.selectionStart = messageInput.selectionEnd = start + emoji.length;
}

function toggleFormatting() {
    isBold = !isBold;
    updateFormattingButton();
    document.getElementById('messageInput').focus();
}

function updateFormattingButton() {
    const buttons = document.querySelectorAll('.action-btn');
    const boldButton = Array.from(buttons).find(btn => btn.textContent === 'B');
    if (boldButton) {
        boldButton.style.background = isBold ? '#667eea' : '#e2e8f0';
        boldButton.style.color = isBold ? 'white' : 'inherit';
    }
}

// Автоматическое изменение высоты текстового поля
document.getElementById('messageInput').addEventListener('input', function() {
    this.style.height = 'auto';
    this.style.height = Math.min(this.scrollHeight, 120) + 'px';
});

// Обработка нажатия Enter (Shift+Enter для новой строки)
document.getElementById('messageInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        sendMessage();
    }
});

document.getElementById('usernameInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        joinChat();
    }
});

// Имитация получения сообщений
function simulateMessageReceiving(data) {
    const messageData = JSON.parse(data);
    
    if (messageData.type === 'message') {
        setTimeout(() => {
            const responses = [
                'Привет! Как дела?',
                'Отличная идея! 👍',
                'Я тоже тут) 😊',
                'Что нового?',
                'Давай обсудим это **важно**',
                'Согласен на 100% ❤️'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const randomUser = ['Максим', 'Саша', 'Маша'][Math.floor(Math.random() * 3)];
            
            addMessage(randomUser, randomResponse);
        }, 1000 + Math.random() * 3000);
    }
}

// Автопрокрутка при загрузке
window.addEventListener('load', scrollToBottom);


