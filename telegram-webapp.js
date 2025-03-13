// Telegram WebApp API интеграция
let tg = window.Telegram.WebApp;

// Инициализация Telegram WebApp
document.addEventListener('DOMContentLoaded', function() {
    // Расширяем на весь экран
    tg.expand();
    
    // Устанавливаем основной цвет
    tg.setHeaderColor('#4A90E2');
    
    // Показываем кнопку "Назад" в хедере
    tg.BackButton.show();
    tg.BackButton.onClick(function() {
        // Обработка нажатия кнопки "Назад"
        const activeScreen = document.querySelector('.screen.active');
        if (activeScreen && activeScreen.id !== 'tasks-screen') {
            // Если мы не на главном экране, возвращаемся на предыдущий
            showScreen('tasks-screen');
        } else {
            // Если мы на главном экране, закрываем приложение
            tg.close();
        }
    });
    
    // Настройка темы в зависимости от темы Telegram
    if (tg.colorScheme === 'dark') {
        document.body.classList.add('dark-theme');
    }
    
    // Получение данных пользователя из Telegram
    if (tg.initDataUnsafe && tg.initDataUnsafe.user) {
        const user = tg.initDataUnsafe.user;
        console.log('Telegram user:', user);
        
        // Здесь можно использовать данные пользователя для персонализации
        // Например, установить имя пользователя
        // document.querySelector('.user-name').textContent = user.first_name;
    }
    
    // Обработка основных событий WebApp
    tg.onEvent('viewportChanged', function() {
        // Обработка изменения размера окна
        console.log('Viewport changed:', tg.viewportHeight, tg.viewportWidth);
    });
    
    // Инициализация приложения после загрузки Telegram WebApp
    initApp();
});

// Функция для отправки данных боту
function sendDataToBot(data) {
    tg.sendData(JSON.stringify(data));
}

// Функция для показа всплывающего уведомления
function showTelegramNotification(message) {
    tg.showPopup({
        title: 'FitChallenge',
        message: message,
        buttons: [{ type: 'ok' }]
    });
}

// Функция для обработки нажатия на кнопку "Поделиться"
function shareToTelegram(text) {
    if (!tg.isExpanded) {
        tg.expand();
    }
    
    tg.showPopup({
        title: 'Поделиться',
        message: 'Хотите поделиться своим достижением?',
        buttons: [
            { id: 'share', type: 'default', text: 'Поделиться' },
            { id: 'cancel', type: 'cancel', text: 'Отмена' }
        ]
    }, function(buttonId) {
        if (buttonId === 'share') {
            // Здесь можно добавить логику для шеринга
            console.log('Пользователь хочет поделиться:', text);
        }
    });
}

// Функция инициализации приложения
function initApp() {
    // Скрываем сплэш-скрин и показываем основной экран
    setTimeout(() => {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('tasks-screen').classList.add('active');
    }, 1500);
    
    // Инициализация обработчиков событий для таб-бара
    document.querySelectorAll('.tab-bar-item').forEach(item => {
        item.addEventListener('click', function() {
            const screenId = this.getAttribute('data-screen');
            showScreen(screenId);
        });
    });
}

// Функция для переключения экранов
function showScreen(screenId) {
    // Скрываем все экраны
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    
    // Показываем выбранный экран
    document.getElementById(screenId).classList.add('active');
    
    // Обновляем активный элемент в таб-баре
    document.querySelectorAll('.tab-bar-item').forEach(item => {
        if (item.getAttribute('data-screen') === screenId) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
    
    // Управление кнопкой "Назад" в Telegram
    if (screenId === 'tasks-screen') {
        tg.BackButton.hide();
    } else {
        tg.BackButton.show();
    }
} 