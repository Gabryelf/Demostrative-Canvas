# 📦 Src — Исходный код

<div align="center">

![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)
![Modules](https://img.shields.io/badge/Modules-ESM-blue.svg)
![Coverage](https://img.shields.io/badge/coverage-85%25-green.svg)

**Исходный код архитектуры Canvas Playground**

</div>

---

```
## 📁 Структура
src/
├── 📂 core/ # Ядро движка (Engine, Scene, GameLoop)
├── 📂 abstract/ # Абстрактные классы и интерфейсы
├── 📂 primitives/ # Базовые примитивы для отрисовки
├── 📂 components/ # Компоненты поведения
├── 📂 behaviors/ # Готовые поведения (композиция)
```

---

## 🏗 Уровни абстракции

### Core (Ядро)
Базовые механизмы, обеспечивающие работу движка:
- **Engine** — главный контроллер
- **Scene** — менеджер сцены
- **GameLoop** — управление временем

### Abstract (Абстракции)
Фундаментальные интерфейсы для всех объектов:
- **GameObject** — основа всех объектов
- **Renderable** — возможность отрисовки
- **Updatable** — возможность обновления
- **Controllable** — возможность управления

### Primitives (Примитивы)
Базовые фигуры для отрисовки:
- **Point** — точка
- **Circle** — круг
- **Rectangle** — прямоугольник
- **Line** — линия
- **Triangle** — треугольник
- **Polygon** — многоугольник

### Components (Компоненты)
Поведенческие модули для композиции:
- **Movement** — движение
- **Rotation** — вращение
- **Scaling** — масштабирование
- **Color** — цветовые эффекты
- **Trail** — след
- **Gravity** — гравитация
- **Collision** — коллизии

### Behaviors (Поведения)
Готовые комбинации компонентов:
- **Bouncing** — отскок
- **Orbiting** — орбитальное движение
- **ParticleSystem** — система частиц
- **WaveMotion** — волновое движение

---

## 🎯 Принципы архитектуры

1. **Композиция** — собирайте сложные поведения из простых компонентов
2. **Наследование** — расширяйте базовые классы для новых типов объектов
3. **Модульность** — каждый модуль независим и тестируем
4. **Расширяемость** — легко добавляйте новые компоненты и поведения

---

## 📖 Документация

- [Core документация](https://github.com/Gabryelf/Demostrative-Canvas/blob/main/README.md)
- [Абстрактные классы](abstract/README.md)
- [Примитивы](primitives/README.md)
- [Компоненты](components/README.md)
- [Поведения](behaviors/README.md)
- [Примеры](examples/README.md)

---

## 🚀 Использование

```javascript
import { Engine } from './core/engine.js';
import { Circle } from './primitives/circle.js';
import { MovementComponent } from './components/movement.js';

// Создание движка
const engine = new Engine('canvas', 800, 600);

// Создание объекта
const ball = new Circle(400, 300, 30, '#ff6b6b');

// Добавление поведения
ball.addComponent(new MovementComponent(200, 150));

// Добавление в сцену
engine.scene.addObject(ball);

// Запуск
engine.start();

```

🤝 Вклад
Если вы хотите добавить новый компонент или поведение:

Следуйте существующей архитектуре

Добавьте документацию

Создайте пример использования

Напишите тесты

Подробнее о контрибьюции →

<div align="center">
⬆ Наверх • На главную

</div>
