/**
 * AvatarController - класс для управления цифровым двойником пользователя (аватаром)
 * в приложении FitChallenge.
 */
class AvatarController {
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
      level: 1,
      energy: 50,
      mood: 50,
      streak: 0,
      achievements: [],
      accessories: [],
      name: 'ФитБадди',
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
    this.updateName();
    this.updateEnergyLevel();
    this.updateMoodLevel();
    this.updateAuraIntensity();
    this.updateAccessories();
    this.updateEmotionalState();
  }
  
  /**
   * Обновляет уровень аватара
   */
  updateLevel() {
    const levelText = this.svgElement.querySelector('text:first-of-type');
    if (levelText) {
      levelText.textContent = `Уровень ${this.state.level}`;
    }
    
    // Разблокировка элементов в зависимости от уровня
    this.unlockLevelBasedItems();
  }
  
  /**
   * Обновляет имя аватара
   */
  updateName() {
    const nameText = this.svgElement.querySelector('text:last-of-type');
    if (nameText) {
      nameText.textContent = this.state.name;
    }
  }
  
  /**
   * Обновляет уровень энергии аватара
   */
  updateEnergyLevel() {
    const energyBar = this.svgElement.querySelector('.energy-level');
    if (energyBar) {
      // Ограничиваем значение от 0 до 100
      const energy = Math.max(0, Math.min(100, this.state.energy));
      
      // Высота полоски энергии (100px - полная шкала)
      const height = energy;
      const y = 150 - energy; // 150 = базовая позиция Y (50) + максимальная высота (100)
      
      // Обновляем атрибуты
      energyBar.setAttribute('height', height);
      energyBar.setAttribute('y', y);
      
      // Меняем цвет в зависимости от уровня энергии
      let color = '#4CAF50'; // Зеленый (высокая энергия)
      if (energy < 30) {
        color = '#F44336'; // Красный (низкая энергия)
      } else if (energy < 70) {
        color = '#FFC107'; // Желтый (средняя энергия)
      }
      energyBar.setAttribute('fill', color);
      
      // Обновляем анимацию
      const animateHeight = energyBar.querySelector('animate[attributeName="height"]');
      const animateY = energyBar.querySelector('animate[attributeName="y"]');
      
      if (animateHeight && animateY) {
        // Небольшие колебания вокруг текущего значения
        const minHeight = Math.max(0, height - 5);
        const maxHeight = Math.min(100, height + 5);
        animateHeight.setAttribute('values', `${height};${maxHeight};${height};${minHeight};${height}`);
        
        const maxY = y + 5;
        const minY = y - 5;
        animateY.setAttribute('values', `${y};${minY};${y};${maxY};${y}`);
      }
    }
  }
  
  /**
   * Обновляет уровень настроения аватара
   */
  updateMoodLevel() {
    const moodBar = this.svgElement.querySelector('.mood-level');
    if (moodBar) {
      // Ограничиваем значение от 0 до 100
      const mood = Math.max(0, Math.min(100, this.state.mood));
      
      // Высота полоски настроения (100px - полная шкала)
      const height = mood;
      const y = 150 - mood; // 150 = базовая позиция Y (50) + максимальная высота (100)
      
      // Обновляем атрибуты
      moodBar.setAttribute('height', height);
      moodBar.setAttribute('y', y);
      
      // Меняем цвет в зависимости от уровня настроения
      let color = '#2196F3'; // Синий (хорошее настроение)
      if (mood < 30) {
        color = '#9C27B0'; // Фиолетовый (плохое настроение)
      } else if (mood < 70) {
        color = '#00BCD4'; // Голубой (нейтральное настроение)
      }
      moodBar.setAttribute('fill', color);
      
      // Обновляем анимацию
      const animateHeight = moodBar.querySelector('animate[attributeName="height"]');
      const animateY = moodBar.querySelector('animate[attributeName="y"]');
      
      if (animateHeight && animateY) {
        // Небольшие колебания вокруг текущего значения
        const minHeight = Math.max(0, height - 5);
        const maxHeight = Math.min(100, height + 5);
        animateHeight.setAttribute('values', `${height};${maxHeight};${height};${minHeight};${height}`);
        
        const maxY = y + 5;
        const minY = y - 5;
        animateY.setAttribute('values', `${y};${minY};${y};${maxY};${y}`);
      }
    }
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
        pathData = 'M90,95 C95,105 105,105 110,95';
        mouth.setAttribute('class', 'mouth happy');
      } else if (this.state.mood >= 30) {
        // Нейтральный
        pathData = 'M90,100 L110,100';
        mouth.setAttribute('class', 'mouth neutral');
      } else {
        // Грустный
        pathData = 'M90,100 C95,95 105,95 110,100';
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
   * Разблокирует элементы аватара в зависимости от уровня
   */
  unlockLevelBasedItems() {
    // Шапка (разблокируется на уровне 5)
    const hat = this.svgElement.querySelector('.hat');
    if (hat) {
      hat.setAttribute('opacity', this.state.level >= 5 ? 0.9 : 0);
    }
    
    // Значок достижений (разблокируется на уровне 10)
    const badge = this.svgElement.querySelector('.badge');
    const badgeText = this.svgElement.querySelector('.badge-text');
    
    if (badge && badgeText) {
      const visible = this.state.level >= 10;
      badge.setAttribute('opacity', visible ? 0.9 : 0);
      badgeText.setAttribute('opacity', visible ? 1 : 0);
      
      // Обновляем текст значка (количество достижений)
      if (visible) {
        badgeText.textContent = this.state.achievements.length || '1';
      }
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
    
    // Проверяем, нужно ли повысить уровень
    // (например, каждые 10 выполнений привычек)
    if (this.state.streak % 10 === 0) {
      this.state.level += 1;
    }
    
    // Обновляем аватар
    this.initAvatar();
    
    // Возвращаем анимацию для отображения реакции на выполнение
    return this.playCompletionAnimation();
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
    
    // Пример: анимация значка достижений
    const badge = this.svgElement.querySelector('.badge');
    if (badge) {
      // Сохраняем текущие значения
      const currentOpacity = badge.querySelector('animate').getAttribute('values');
      
      // Устанавливаем высокую интенсивность
      badge.querySelector('animate').setAttribute('values', '0.7;1;0.7');
      badge.querySelector('animate').setAttribute('dur', '0.5s');
      
      // Возвращаем исходные значения через 1.5 секунды
      setTimeout(() => {
        badge.querySelector('animate').setAttribute('values', currentOpacity);
        badge.querySelector('animate').setAttribute('dur', '2s');
      }, 1500);
    }
    
    return 'achievement';
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
  const avatarController = new AvatarController('avatar-svg', {
    level: 5,
    energy: 70,
    mood: 80,
    streak: 7,
    name: 'ФитБадди'
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
});
*/ 