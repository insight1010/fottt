// Инициализация приложения
document.addEventListener('DOMContentLoaded', () => {
    // Имитация загрузки приложения
    setTimeout(() => {
        document.getElementById('splash-screen').classList.remove('active');
        document.getElementById('tasks-screen').classList.add('active');
        document.querySelector('.tab-bar-item[data-screen="tasks-screen"]').classList.add('active');
    }, 2000);

    // Инициализация обработчиков событий
    initTabBar();
    initTabs();
    initCheckboxes();
    initRatingButtons();
    initProbabilitySystem();
    initNotifications();
    initPageAura();
    
    // Инициализация аватара при переходе на экран профиля
    document.querySelector('.tab-bar-item[data-screen="profile-screen"]').addEventListener('click', () => {
        setTimeout(initAvatar, 100);
    });
});

// Инициализация навигации по таб-бару
function initTabBar() {
    const tabBarItems = document.querySelectorAll('.tab-bar-item');
    
    tabBarItems.forEach(item => {
        item.addEventListener('click', () => {
            // Удаляем активный класс у всех элементов таб-бара
            tabBarItems.forEach(i => i.classList.remove('active'));
            
            // Добавляем активный класс к выбранному элементу
            item.classList.add('active');
            
            // Получаем ID экрана, который нужно показать
            const screenId = item.getAttribute('data-screen');
            
            // Скрываем все экраны
            document.querySelectorAll('.screen').forEach(screen => {
                screen.classList.remove('active');
            });
            
            // Показываем выбранный экран
            document.getElementById(screenId).classList.add('active');
            
            // Если переходим на экран профиля, инициализируем аватар
            if (screenId === 'profile-screen') {
                setTimeout(initAvatar, 100);
            }
        });
    });
    
    // Исправление проблемы с кликом по аватару в таб-баре
    const avatarContainer = document.querySelector('.tab-bar-item-center .tab-bar-avatar');
    if (avatarContainer) {
        avatarContainer.addEventListener('click', (e) => {
            // Предотвращаем всплытие события, чтобы оно не перехватывалось object
            e.stopPropagation();
            
            // Имитируем клик по родительской кнопке таб-бара
            const tabBarItem = avatarContainer.closest('.tab-bar-item');
            if (tabBarItem) {
                tabBarItem.click();
            }
        });
    }
}

// Инициализация вкладок внутри экранов
function initTabs() {
    // Основные вкладки
    const tabs = document.querySelectorAll('.tab');
    
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            // Находим родительский контейнер вкладок
            const tabsContainer = tab.closest('.tabs');
            
            // Удаляем активный класс у всех вкладок в этом контейнере
            tabsContainer.querySelectorAll('.tab').forEach(t => {
                t.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранной вкладке
            tab.classList.add('active');
            
            // Получаем ID вкладки
            const tabId = tab.getAttribute('data-tab');
            
            // Обновляем содержимое в зависимости от выбранной вкладки
            updateTabContent(tabId);
        });
    });
    
    // Подвкладки (текущие/завершенные)
    const subtabs = document.querySelectorAll('.subtab');
    
    subtabs.forEach(subtab => {
        subtab.addEventListener('click', () => {
            // Находим родительский контейнер подвкладок
            const subtabsContainer = subtab.closest('.subtabs');
            
            // Удаляем активный класс у всех подвкладок в этом контейнере
            subtabsContainer.querySelectorAll('.subtab').forEach(st => {
                st.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранной подвкладке
            subtab.classList.add('active');
            
            // Получаем ID подвкладки
            const subtabId = subtab.getAttribute('data-subtab');
            
            // Обновляем содержимое в зависимости от выбранной подвкладки
            updateSubtabContent(subtabId);
        });
    });
}

// Обновление содержимого в зависимости от выбранной вкладки
function updateTabContent(tabId) {
    // Получаем активную подвкладку
    const activeSubtab = document.querySelector('.subtab.active');
    const subtabId = activeSubtab ? activeSubtab.getAttribute('data-subtab') : 'current';
    
    // Скрываем все содержимое вкладок
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Показываем содержимое выбранной вкладки и подвкладки
    const contentId = `${tabId}-${subtabId}`;
    const content = document.getElementById(contentId);
    
    if (content) {
        content.classList.add('active');
    } else if (tabId === 'groups') {
        document.getElementById('groups-content').classList.add('active');
    } else if (tabId === 'friends') {
        document.getElementById('friends-content').classList.add('active');
    } else if (tabId === 'feed') {
        document.getElementById('feed-content').classList.add('active');
    }
}

// Обновление содержимого в зависимости от выбранной подвкладки
function updateSubtabContent(subtabId) {
    // Получаем активную вкладку
    const activeTab = document.querySelector('.tab.active');
    const tabId = activeTab ? activeTab.getAttribute('data-tab') : 'personal';
    
    // Скрываем все содержимое вкладок
    document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
    });
    
    // Показываем содержимое выбранной вкладки и подвкладки
    const contentId = `${tabId}-${subtabId}`;
    const content = document.getElementById(contentId);
    
    if (content) {
        content.classList.add('active');
    }
}

// Инициализация чекбоксов
function initCheckboxes() {
    const checkboxes = document.querySelectorAll('.habit-checkbox, .task-checkbox, .challenge-checkbox');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
            if (checkbox.checked) {
                // Если чекбокс отмечен, показываем уведомление о выполнении
                showNotification('Задача выполнена! +0.2 балла вероятности', 'success');
                
                // Обновляем вероятность успеха
                updateProbability(0.2);
            }
        });
    });
}

// Инициализация кнопок рейтинга
function initRatingButtons() {
    const ratingButtons = document.querySelectorAll('.rating-btn');
    
    ratingButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Удаляем активный класс у всех кнопок рейтинга в этой группе
            const ratingContainer = button.closest('.rating');
            ratingContainer.querySelectorAll('.rating-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            // Добавляем активный класс к выбранной кнопке
            button.classList.add('active');
            
            // Получаем значение рейтинга
            const rating = button.getAttribute('data-rating');
            
            // Показываем уведомление о начислении баллов
            showNotification(`Спасибо за оценку! +0.33 балла вероятности`, 'success');
            
            // Обновляем вероятность успеха
            updateProbability(0.33);
        });
    });
}

// Инициализация системы вероятностей
function initProbabilitySystem() {
    // Кнопка "Буст"
    const boostButton = document.querySelector('.btn-boost');
    
    if (boostButton) {
        boostButton.addEventListener('click', () => {
            // Показываем уведомление о применении буста
            showNotification('Буст применен! +5% к вероятности успеха на 24 часа', 'success');
            
            // Обновляем вероятность успеха
            updateProbability(5);
        });
    }
    
    // Кнопки "Загрузить фото"
    const uploadButtons = document.querySelectorAll('.btn-upload');
    
    uploadButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Имитация загрузки фото
            setTimeout(() => {
                showNotification('Фото загружено! +0.2 балла вероятности', 'success');
                updateProbability(0.2);
            }, 1000);
        });
    });
}

// Обновление вероятности успеха
function updateProbability(increment) {
    // Обновляем значение вероятности в профиле
    const probabilityBar = document.querySelector('.stat-card:first-child .progress');
    
    if (probabilityBar) {
        // Получаем текущее значение
        const currentValue = parseFloat(probabilityBar.querySelector('.progress-value').textContent);
        
        // Вычисляем новое значение
        let newValue = currentValue + increment;
        
        // Ограничиваем значение от 0 до 100
        newValue = Math.min(Math.max(newValue, 0), 100);
        
        // Обновляем значение и ширину прогресс-бара
        probabilityBar.style.width = `${newValue}%`;
        probabilityBar.querySelector('.progress-value').textContent = `${newValue.toFixed(0)}%`;
    }
    
    // Обновляем значения вероятности для привычек
    document.querySelectorAll('.probability-value').forEach(value => {
        // Получаем текущее значение
        const currentValue = parseFloat(value.textContent);
        
        // Вычисляем новое значение (увеличиваем на небольшую случайную величину)
        const randomIncrement = (Math.random() * 0.02).toFixed(2);
        let newValue = currentValue + parseFloat(randomIncrement);
        
        // Ограничиваем значение от 0 до 1
        newValue = Math.min(Math.max(newValue, 0), 1);
        
        // Обновляем значение
        value.textContent = newValue.toFixed(2);
    });
}

// Функция для отображения уведомлений
function showNotification(message, type = 'info') {
    // Создаем элемент уведомления
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    
    // Добавляем иконку в зависимости от типа
    let icon = '';
    switch (type) {
        case 'success':
            icon = '<i class="fas fa-check-circle"></i>';
            break;
        case 'error':
            icon = '<i class="fas fa-times-circle"></i>';
            break;
        case 'warning':
            icon = '<i class="fas fa-exclamation-triangle"></i>';
            break;
        default:
            icon = '<i class="fas fa-info-circle"></i>';
    }
    
    // Устанавливаем содержимое
    notification.innerHTML = `
        ${icon}
        <span>${message}</span>
    `;
    
    // Добавляем на страницу
    const notificationsContainer = document.getElementById('notifications-container');
    if (!notificationsContainer) {
        // Если контейнер не существует, создаем его
        const container = document.createElement('div');
        container.id = 'notifications-container';
        document.body.appendChild(container);
        container.appendChild(notification);
    } else {
        notificationsContainer.appendChild(notification);
    }
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Автоматическое скрытие через 3 секунды
    setTimeout(() => {
        notification.classList.remove('show');
        notification.classList.add('hide');
        
        // Удаляем элемент после завершения анимации
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Инициализация аватара
function initAvatar() {
    // Проверяем, находимся ли мы на экране профиля
    if (!document.getElementById('profile-screen').classList.contains('active')) {
        return;
    }
    
    // Получаем элемент изображения аватара
    const avatarImg = document.querySelector('.avatar-image');
    if (!avatarImg) {
        console.error('Элемент аватара не найден');
        return;
    }
    
    // Проверяем, загружено ли изображение
    if (!avatarImg.complete) {
        // Если изображение еще не загружено, добавляем обработчик события загрузки
        avatarImg.addEventListener('load', function() {
            console.log('Аватар загружен успешно');
            updateAvatarState();
        });
        
        // Добавляем обработчик ошибки загрузки
        avatarImg.addEventListener('error', function() {
            console.error('Ошибка загрузки аватара');
            // Заменяем на запасное изображение или иконку
            avatarImg.style.display = 'none';
            const avatarContainer = document.querySelector('.avatar-container');
            if (avatarContainer) {
                const fallbackIcon = document.createElement('i');
                fallbackIcon.className = 'fas fa-user-circle';
                fallbackIcon.style.fontSize = '120px';
                fallbackIcon.style.color = '#7C4DFF';
                avatarContainer.appendChild(fallbackIcon);
            }
        });
    } else {
        // Если изображение уже загружено
        console.log('Аватар уже загружен');
        updateAvatarState();
    }
    
    // Обновляем состояние аватара
    function updateAvatarState() {
        // Создаем контроллер аватара
        const avatarController = {
            // Состояние аватара
            state: {
                level: 4,
                energy: 78,
                mood: 85,
                streak: 7,
                experience: 320,
                maxExperience: 800,
                achievements: 3,
                accessories: ['badge'],
                belt: 'green',
                name: 'Фитнес Герой',
                coins: 1250
            },
            
            // Обновляет уровень аватара
            updateLevel: function() {
                // Обновляем значок уровня на странице
                const levelBadge = document.querySelector('.level-badge span');
                if (levelBadge) {
                    levelBadge.textContent = this.state.level;
                }
            },
            
            // Обновляет ауру вокруг аватара
            updateAura: function() {
                // Интенсивность ауры зависит от уровня энергии
                const intensity = this.state.energy / 100;
                
                // Обновляем ауру на странице
                const aura = document.querySelector('.avatar-aura');
                if (aura) {
                    aura.style.opacity = 0.3 + (intensity * 0.7);
                    aura.style.transform = `scale(${0.9 + (intensity * 0.2)})`;
                }
            },
            
            // Обновляет статус на странице
            updatePageStatus: function() {
                // Обновляем значок уровня
                const levelBadge = document.querySelector('.level-badge span');
                if (levelBadge) {
                    levelBadge.textContent = this.state.level;
                }
                
                // Обновляем значок валюты
                const currencyBadge = document.querySelector('.currency-badge span');
                if (currencyBadge) {
                    currencyBadge.textContent = this.state.coins;
                }
                
                // Обновляем значок пояса
                const beltBadge = document.querySelector('.belt-badge');
                if (beltBadge) {
                    beltBadge.textContent = this.getBeltName();
                }
                
                // Обновляем статистику
                const probabilityStat = document.querySelector('.stat-value[data-stat="probability"] span');
                if (probabilityStat) {
                    const probabilityPercent = Math.round(this.state.experience / this.state.maxExperience * 100);
                    probabilityStat.textContent = probabilityPercent;
                    probabilityStat.closest('.stat-card').querySelector('.progress').style.width = `${probabilityPercent}%`;
                    probabilityStat.closest('.stat-card').querySelector('.progress-value').textContent = `${probabilityPercent}%`;
                }
                
                const energyStat = document.querySelector('.stat-value[data-stat="energy"] span');
                if (energyStat) {
                    energyStat.textContent = this.state.energy;
                    energyStat.closest('.stat-card').querySelector('.progress').style.width = `${this.state.energy}%`;
                    energyStat.closest('.stat-card').querySelector('.progress-value').textContent = `${this.state.energy}%`;
                }
                
                const moodStat = document.querySelector('.stat-value[data-stat="mood"] span');
                if (moodStat) {
                    moodStat.textContent = this.state.mood;
                    moodStat.closest('.stat-card').querySelector('.progress').style.width = `${this.state.mood}%`;
                    moodStat.closest('.stat-card').querySelector('.progress-value').textContent = `${this.state.mood}%`;
                }
                
                const expStat = document.querySelector('.stat-value[data-stat="exp"] span');
                if (expStat) {
                    expStat.textContent = `${this.state.experience}/${this.state.maxExperience}`;
                    const expPercent = Math.round(this.state.experience / this.state.maxExperience * 100);
                    expStat.closest('.stat-card').querySelector('.progress').style.width = `${expPercent}%`;
                    expStat.closest('.stat-card').querySelector('.progress-value').textContent = `${expPercent}%`;
                }
                
                const streakStat = document.querySelector('.stat-value[data-stat="streak"] span');
                if (streakStat) {
                    streakStat.textContent = this.state.streak;
                    const streakPercent = Math.min(this.state.streak * 10, 100);
                    streakStat.closest('.stat-card').querySelector('.progress').style.width = `${streakPercent}%`;
                    streakStat.closest('.stat-card').querySelector('.progress-value').textContent = `${this.state.streak}/10`;
                }
            },
            
            // Получает название пояса на русском
            getBeltName: function() {
                switch (this.state.belt) {
                    case 'white': return 'Белый пояс';
                    case 'yellow': return 'Желтый пояс';
                    case 'orange': return 'Оранжевый пояс';
                    case 'green': return 'Зеленый пояс';
                    case 'blue': return 'Синий пояс';
                    case 'brown': return 'Коричневый пояс';
                    case 'black': return 'Черный пояс';
                    default: return 'Белый пояс';
                }
            },
            
            // Инициализирует аватар
            initAvatar: function() {
                this.updateLevel();
                this.updateAura();
                this.updatePageStatus();
            }
        };
        
        // Инициализируем аватар
        avatarController.initAvatar();
        
        // Добавляем обработчики событий для кнопок
        initAvatarButtons(avatarController);
    }
}

// Инициализация кнопок для аватара
function initAvatarButtons(avatarController) {
    // Кнопка буста
    const boostBtn = document.getElementById('boost-btn');
    if (boostBtn) {
        boostBtn.addEventListener('click', function() {
            // Анимация нажатия
            this.classList.add('pressed');
            setTimeout(() => this.classList.remove('pressed'), 200);
            
            // Применяем буст
            avatarController.state.energy = Math.min(100, avatarController.state.energy + 30);
            avatarController.state.mood = Math.min(100, avatarController.state.mood + 20);
            
            // Обновляем аватар
            avatarController.updateAura();
            avatarController.updatePageStatus();
        });
    }
    
    // Кнопка выполнения привычки
    const completeHabitBtn = document.getElementById('complete-habit-btn');
    if (completeHabitBtn) {
        completeHabitBtn.addEventListener('click', function() {
            // Анимация нажатия
            this.classList.add('pressed');
            setTimeout(() => this.classList.remove('pressed'), 200);
            
            // Обновляем состояние
            avatarController.state.streak++;
            avatarController.state.energy = Math.min(100, avatarController.state.energy + 10);
            avatarController.state.mood = Math.min(100, avatarController.state.mood + 15);
            avatarController.state.experience += 50;
            
            // Проверяем повышение уровня
            if (avatarController.state.experience >= avatarController.state.maxExperience) {
                avatarController.state.level++;
                avatarController.state.experience -= avatarController.state.maxExperience;
                avatarController.state.maxExperience = Math.floor(avatarController.state.maxExperience * 1.2);
            }
            
            // Обновляем аватар
            avatarController.updateLevel();
            avatarController.updateAura();
            avatarController.updatePageStatus();
        });
    }
    
    // Кнопка пропуска привычки
    const skipHabitBtn = document.getElementById('skip-habit-btn');
    if (skipHabitBtn) {
        skipHabitBtn.addEventListener('click', function() {
            // Анимация нажатия
            this.classList.add('pressed');
            setTimeout(() => this.classList.remove('pressed'), 200);
            
            // Обновляем состояние
            avatarController.state.streak = 0;
            avatarController.state.energy = Math.max(0, avatarController.state.energy - 20);
            avatarController.state.mood = Math.max(0, avatarController.state.mood - 25);
            
            // Обновляем аватар
            avatarController.updateAura();
            avatarController.updatePageStatus();
        });
    }
    
    // Кнопка получения достижения
    const addAchievementBtn = document.getElementById('add-achievement-btn');
    if (addAchievementBtn) {
        addAchievementBtn.addEventListener('click', function() {
            // Анимация нажатия
            this.classList.add('pressed');
            setTimeout(() => this.classList.remove('pressed'), 200);
            
            // Обновляем состояние
            avatarController.state.achievements++;
            avatarController.state.mood = Math.min(100, avatarController.state.mood + 20);
            avatarController.state.experience += 100;
            avatarController.state.coins += 250;
            
            // Проверяем повышение уровня
            if (avatarController.state.experience >= avatarController.state.maxExperience) {
                avatarController.state.level++;
                avatarController.state.experience -= avatarController.state.maxExperience;
                avatarController.state.maxExperience = Math.floor(avatarController.state.maxExperience * 1.2);
            }
            
            // Обновляем аватар
            avatarController.updateLevel();
            avatarController.updateAura();
            avatarController.updatePageStatus();
        });
    }
}

// Анимация ауры на странице
function initPageAura() {
    const aura = document.querySelector('.avatar-aura');
    if (aura) {
        setInterval(() => {
            const size = 300 + Math.random() * 20;
            aura.style.width = `${size}px`;
            aura.style.height = `${size}px`;
        }, 2000);
    }
}

// Инициализация системы уведомлений
function initNotifications() {
    // Создаем контейнер для уведомлений, если его еще нет
    if (!document.getElementById('notifications-container')) {
        const container = document.createElement('div');
        container.id = 'notifications-container';
        document.body.appendChild(container);
    }
} 