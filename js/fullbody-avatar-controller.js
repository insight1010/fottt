/**
 * FullbodyAvatarController - класс для управления цифровым двойником пользователя (аватаром в полный рост)
 * в приложении FitChallenge.
 */
class FullbodyAvatarController {
  /**
   * Создает экземпляр контроллера аватара
   * @param {string} svgElementId - ID SVG-элемента аватара в DOM
   * @param {Object} initialState - Начальное состояние аватара
   */
  constructor(svgElementId, initialState = {}) {
    this.svgElement = document.getElementById(svgElementId);
    if (!this.svgElement) {
      console.error('SVG элемент аватара не найден!');
      return;
    }
    
    // Значения по умолчанию
    this.state = {
      level: 4,
      energy: 78,
      mood: 85,
      streak: 7,
      experience: 320,
      maxExperience: 800,
      achievements: [],
      accessories: [],
      belt: 'green', // white, yellow, orange, green, blue, brown, black
      name: 'ФитБадди',
      coins: 1250,
      ...initialState
    };
    
    // Инициализация аватара
    this.initAvatar();
  }
  
  /**
   * Инициализирует аватар с текущим состоянием
   */
  initAvatar() {
    // Обновляем все элементы аватара
    this.updateLevel();
    this.updateAuraIntensity();
    this.updateEmotionalState();
    this.updateBelt();
    this.updateAccessories();
    this.updateParticles();
  }
  
  /**
   * Обновляет уровень аватара
   */
  updateLevel() {
    const badgeText = this.svgElement.querySelector('.badge-text');
    if (badgeText) {
      badgeText.textContent = this.state.level;
    }
    
    // Разблокировка элементов в зависимости от уровня
    this.unlockLevelBasedItems();
  }
  
  /**
   * Обновляет интенсивность ауры в зависимости от серии выполнений
   */
  updateAuraIntensity() {
    const aura = this.svgElement.querySelector('.aura');
    if (aura) {
      // Базовая непрозрачность ауры
      let baseOpacity = 0.3;
      
      // Увеличиваем интенсивность в зависимости от серии выполнений
      if (this.state.streak > 0) {
        // Максимальная непрозрачность 0.9 при серии 30+
        baseOpacity += Math.min(0.6, this.state.streak * 0.02);
      }
      
      // Обновляем анимацию непрозрачности
      const animateOpacity = aura.querySelector('animate[attributeName="opacity"]');
      if (animateOpacity) {
        const minOpacity = Math.max(0.1, baseOpacity - 0.1);
        const maxOpacity = Math.min(0.9, baseOpacity + 0.1);
        animateOpacity.setAttribute('values', `${baseOpacity};${maxOpacity};${baseOpacity}`);
      }
      
      // Меняем цвет ауры в зависимости от уровня
      const gradient = this.svgElement.querySelector('#auraGradient stop:first-child');
      if (gradient) {
        let color = '#7C4DFF'; // Фиолетовый (начальный)
        
        if (this.state.level >= 20) {
          color = '#FFD700'; // Золотой (высокий уровень)
        } else if (this.state.level >= 10) {
          color = '#2196F3'; // Синий (средний уровень)
        } else if (this.state.level >= 5) {
          color = '#4CAF50'; // Зеленый (низкий уровень)
        }
        
        gradient.setAttribute('stop-color', color);
      }
    }
  }
  
  /**
   * Обновляет эмоциональное состояние аватара (выражение лица)
   */
  updateEmotionalState() {
    const mouth = this.svgElement.querySelector('.mouth');
    if (mouth) {
      // Определяем эмоцию на основе настроения
      let pathData = '';
      
      if (this.state.mood >= 70) {
        // Счастливый
        pathData = 'M140,130 C145,135 155,135 160,130';
        mouth.setAttribute('class', 'mouth happy');
      } else if (this.state.mood >= 30) {
        // Нейтральный
        pathData = 'M140,130 L160,130';
        mouth.setAttribute('class', 'mouth neutral');
      } else {
        // Грустный
        pathData = 'M140,135 C145,130 155,130 160,135';
        mouth.setAttribute('class', 'mouth sad');
      }
      
      mouth.setAttribute('d', pathData);
    }
    
    // Обновляем румянец на щеках
    const cheeks = this.svgElement.querySelectorAll('#avatar-body circle[fill="#FFB3B3"]');
    if (cheeks.length) {
      // Интенсивность румянца зависит от энергии
      const opacity = this.state.energy > 70 ? 0.5 : (this.state.energy > 30 ? 0.3 : 0.1);
      
      cheeks.forEach(cheek => {
        cheek.setAttribute('opacity', opacity);
      });
    }
  }
  
  /**
   * Обновляет пояс аватара в зависимости от уровня
   */
  updateBelt() {
    const belt = this.svgElement.querySelector('rect[x="120"][y="280"]');
    if (belt) {
      // Цвет пояса в зависимости от значения
      let color = '#FFFFFF'; // Белый (начальный)
      
      switch (this.state.belt) {
        case 'white':
          color = '#FFFFFF';
          break;
        case 'yellow':
          color = '#FFEB3B';
          break;
        case 'orange':
          color = '#FF9800';
          break;
        case 'green':
          color = '#4CAF50';
          break;
        case 'blue':
          color = '#2196F3';
          break;
        case 'brown':
          color = '#795548';
          break;
        case 'black':
          color = '#212121';
          break;
        default:
          color = '#FFFFFF';
      }
      
      belt.setAttribute('fill', color);
    }
  }
  
  /**
   * Разблокирует элементы аватара в зависимости от уровня
   */
  unlockLevelBasedItems() {
    // Значок на груди (всегда видим, но меняется стиль)
    const badge = this.svgElement.querySelector('.badge');
    if (badge) {
      // Меняем цвет и размер в зависимости от уровня
      let color = '#FFD700'; // Золотой (по умолчанию)
      let size = 12;
      
      if (this.state.level >= 20) {
        color = '#E91E63'; // Розовый (высокий уровень)
        size = 14;
      } else if (this.state.level >= 10) {
        color = '#FF5722'; // Оранжевый (средний уровень)
        size = 13;
      } else if (this.state.level >= 5) {
        color = '#FFC107'; // Желтый (низкий уровень)
        size = 12;
      }
      
      badge.setAttribute('fill', color);
      badge.setAttribute('r', size);
    }
  }
  
  /**
   * Обновляет аксессуары аватара
   */
  updateAccessories() {
    // Здесь можно добавить логику для отображения различных аксессуаров
    // в зависимости от достижений и уровня пользователя
  }
  
  /**
   * Обновляет частицы вокруг аватара
   */
  updateParticles() {
    const particles = this.svgElement.querySelector('#particles');
    if (particles) {
      // Непрозрачность частиц зависит от энергии
      const opacity = this.state.energy / 100 * 0.7;
      particles.setAttribute('opacity', opacity);
    }
  }
  
  /**
   * Обновляет состояние аватара
   * @param {Object} newState - Новое состояние аватара
   */
  updateState(newState) {
    // Обновляем состояние
    this.state = {
      ...this.state,
      ...newState
    };
    
    // Обновляем визуальное представление
    this.initAvatar();
    
    // Возвращаем текущее состояние
    return this.state;
  }
  
  /**
   * Обрабатывает выполнение привычки
   * @param {Object} habit - Данные о выполненной привычке
   */
  handleHabitCompletion(habit) {
    // Увеличиваем серию выполнений
    this.state.streak += 1;
    
    // Увеличиваем энергию и настроение
    this.state.energy = Math.min(100, this.state.energy + 10);
    this.state.mood = Math.min(100, this.state.mood + 15);
    
    // Добавляем опыт
    const expGain = 20 + Math.floor(Math.random() * 10); // 20-29 опыта
    this.state.experience += expGain;
    
    // Добавляем монеты
    const coinsGain = 50 + Math.floor(Math.random() * 50); // 50-99 монет
    this.state.coins += coinsGain;
    
    // Проверяем, нужно ли повысить уровень
    this.checkLevelUp();
    
    // Обновляем аватар
    this.initAvatar();
    
    // Возвращаем анимацию для отображения реакции на выполнение
    return this.playCompletionAnimation();
  }
  
  /**
   * Проверяет, нужно ли повысить уровень
   */
  checkLevelUp() {
    if (this.state.experience >= this.state.maxExperience) {
      // Повышаем уровень
      this.state.level += 1;
      
      // Вычисляем остаток опыта
      const remainingExp = this.state.experience - this.state.maxExperience;
      
      // Увеличиваем максимальный опыт для следующего уровня
      this.state.maxExperience = Math.floor(this.state.maxExperience * 1.5);
      
      // Устанавливаем текущий опыт
      this.state.experience = remainingExp;
      
      // Проверяем, нужно ли изменить пояс
      this.checkBeltUpgrade();
      
      return true;
    }
    
    return false;
  }
  
  /**
   * Проверяет, нужно ли повысить пояс
   */
  checkBeltUpgrade() {
    const belts = ['white', 'yellow', 'orange', 'green', 'blue', 'brown', 'black'];
    const currentBeltIndex = belts.indexOf(this.state.belt);
    
    // Повышаем пояс каждые 5 уровней
    const targetBeltIndex = Math.min(Math.floor(this.state.level / 5), belts.length - 1);
    
    if (targetBeltIndex > currentBeltIndex) {
      this.state.belt = belts[targetBeltIndex];
      return true;
    }
    
    return false;
  }
  
  /**
   * Обрабатывает пропуск привычки
   */
  handleHabitSkipped() {
    // Сбрасываем серию выполнений
    this.state.streak = 0;
    
    // Уменьшаем энергию и настроение
    this.state.energy = Math.max(10, this.state.energy - 15);
    this.state.mood = Math.max(10, this.state.mood - 20);
    
    // Обновляем аватар
    this.initAvatar();
    
    // Возвращаем анимацию для отображения реакции на пропуск
    return this.playSkippedAnimation();
  }
  
  /**
   * Воспроизводит анимацию реакции на выполнение привычки
   */
  playCompletionAnimation() {
    // Здесь можно добавить логику для воспроизведения анимации
    // Например, подпрыгивание аватара, вспышка ауры и т.д.
    
    // Пример: временно увеличиваем интенсивность ауры
    const aura = this.svgElement.querySelector('.aura');
    if (aura) {
      // Сохраняем текущие значения
      const currentOpacity = aura.querySelector('animate[attributeName="opacity"]').getAttribute('values');
      
      // Устанавливаем высокую интенсивность
      aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', '0.7;1;0.7');
      
      // Возвращаем исходные значения через 1 секунду
      setTimeout(() => {
        aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', currentOpacity);
      }, 1000);
    }
    
    // Анимация частиц
    const particles = this.svgElement.querySelector('#particles');
    if (particles) {
      particles.setAttribute('opacity', '1');
      
      setTimeout(() => {
        particles.setAttribute('opacity', this.state.energy / 100 * 0.7);
      }, 1000);
    }
    
    return 'completion';
  }
  
  /**
   * Воспроизводит анимацию реакции на пропуск привычки
   */
  playSkippedAnimation() {
    // Здесь можно добавить логику для воспроизведения анимации
    // Например, поникание аватара, потускнение ауры и т.д.
    
    // Пример: временно уменьшаем интенсивность ауры
    const aura = this.svgElement.querySelector('.aura');
    if (aura) {
      // Сохраняем текущие значения
      const currentOpacity = aura.querySelector('animate[attributeName="opacity"]').getAttribute('values');
      
      // Устанавливаем низкую интенсивность
      aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', '0.2;0.3;0.2');
      
      // Возвращаем исходные значения через 1 секунду
      setTimeout(() => {
        aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', currentOpacity);
      }, 1000);
    }
    
    // Уменьшаем видимость частиц
    const particles = this.svgElement.querySelector('#particles');
    if (particles) {
      particles.setAttribute('opacity', '0.1');
      
      setTimeout(() => {
        particles.setAttribute('opacity', this.state.energy / 100 * 0.7);
      }, 1000);
    }
    
    return 'skipped';
  }
  
  /**
   * Добавляет достижение
   * @param {Object} achievement - Данные о достижении
   */
  addAchievement(achievement) {
    // Добавляем достижение в список
    this.state.achievements.push(achievement);
    
    // Увеличиваем настроение
    this.state.mood = Math.min(100, this.state.mood + 25);
    
    // Добавляем опыт
    this.state.experience += 50;
    
    // Добавляем монеты
    this.state.coins += 100;
    
    // Проверяем, нужно ли повысить уровень
    this.checkLevelUp();
    
    // Обновляем аватар
    this.initAvatar();
    
    // Возвращаем анимацию для отображения получения достижения
    return this.playAchievementAnimation();
  }
  
  /**
   * Воспроизводит анимацию получения достижения
   */
  playAchievementAnimation() {
    // Здесь можно добавить логику для воспроизведения анимации
    // Например, вспышка значка достижений, специальный эффект и т.д.
    
    // Пример: анимация значка на груди
    const badge = this.svgElement.querySelector('.badge');
    if (badge) {
      // Сохраняем текущие значения
      const currentSize = badge.getAttribute('r');
      const currentColor = badge.getAttribute('fill');
      
      // Устанавливаем эффект вспышки
      badge.setAttribute('r', parseInt(currentSize) + 5);
      badge.setAttribute('fill', '#FFFFFF');
      
      // Возвращаем исходные значения через 1 секунду
      setTimeout(() => {
        badge.setAttribute('r', currentSize);
        badge.setAttribute('fill', currentColor);
      }, 1000);
    }
    
    // Анимация ауры
    const aura = this.svgElement.querySelector('.aura');
    if (aura) {
      // Сохраняем текущие значения
      const currentOpacity = aura.querySelector('animate[attributeName="opacity"]').getAttribute('values');
      
      // Устанавливаем высокую интенсивность
      aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', '0.8;1;0.8');
      
      // Возвращаем исходные значения через 1.5 секунды
      setTimeout(() => {
        aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', currentOpacity);
      }, 1500);
    }
    
    return 'achievement';
  }
  
  /**
   * Применяет буст к аватару
   * @param {number} duration - Продолжительность буста в секундах
   */
  applyBoost(duration = 3600) {
    // Увеличиваем энергию и настроение
    this.state.energy = 100;
    this.state.mood = 100;
    
    // Обновляем аватар
    this.initAvatar();
    
    // Анимация буста
    this.playBoostAnimation();
    
    // Возвращаем информацию о бусте
    return {
      active: true,
      duration: duration,
      startTime: new Date().getTime()
    };
  }
  
  /**
   * Воспроизводит анимацию применения буста
   */
  playBoostAnimation() {
    // Анимация ауры
    const aura = this.svgElement.querySelector('.aura');
    if (aura) {
      // Сохраняем текущие значения
      const currentOpacity = aura.querySelector('animate[attributeName="opacity"]').getAttribute('values');
      const currentR = aura.querySelector('animate[attributeName="r"]').getAttribute('values');
      
      // Устанавливаем эффект вспышки
      aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', '0.9;1;0.9');
      aura.querySelector('animate[attributeName="r"]').setAttribute('values', '145;165;145');
      
      // Возвращаем исходные значения через 3 секунды
      setTimeout(() => {
        aura.querySelector('animate[attributeName="opacity"]').setAttribute('values', currentOpacity);
        aura.querySelector('animate[attributeName="r"]').setAttribute('values', currentR);
      }, 3000);
    }
    
    // Анимация частиц
    const particles = this.svgElement.querySelector('#particles');
    if (particles) {
      particles.setAttribute('opacity', '1');
      
      setTimeout(() => {
        particles.setAttribute('opacity', this.state.energy / 100 * 0.7);
      }, 3000);
    }
    
    return 'boost';
  }
  
  /**
   * Экспортирует текущее состояние аватара
   */
  exportState() {
    return { ...this.state };
  }
  
  /**
   * Импортирует состояние аватара
   * @param {Object} state - Состояние для импорта
   */
  importState(state) {
    if (state && typeof state === 'object') {
      this.updateState(state);
      return true;
    }
    return false;
  }
}

// Пример использования:
/*
document.addEventListener('DOMContentLoaded', () => {
  // Создаем контроллер аватара
  const avatarController = new FullbodyAvatarController('avatar-svg', {
    level: 4,
    energy: 78,
    mood: 85,
    streak: 7,
    experience: 320,
    maxExperience: 800,
    belt: 'green',
    name: 'ФитБадди',
    coins: 1250
  });
  
  // Пример обработки выполнения привычки
  document.getElementById('complete-habit-btn').addEventListener('click', () => {
    avatarController.handleHabitCompletion({ id: 1, name: 'Утренняя зарядка' });
  });
  
  // Пример обработки пропуска привычки
  document.getElementById('skip-habit-btn').addEventListener('click', () => {
    avatarController.handleHabitSkipped();
  });
  
  // Пример добавления достижения
  document.getElementById('add-achievement-btn').addEventListener('click', () => {
    avatarController.addAchievement({ 
      id: 1, 
      name: 'Первая неделя', 
      description: 'Выполняйте привычки 7 дней подряд' 
    });
  });
  
  // Пример применения буста
  document.getElementById('boost-btn').addEventListener('click', () => {
    avatarController.applyBoost();
  });
});
*/ 