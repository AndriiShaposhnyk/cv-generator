🧾 CV Generator — React + TypeScript + Node.js

CV Generator — застосунок, який створює DOCX-резюме на основі введених користувачем даних.
Проєкт має бекенд на Node.js + Express (TypeScript), який генерує .docx-файл,
та опціонально може використовувати LLM-модель (Hugging Face API) для автоматичного “полірування” тексту резюме.

⚙️ # Локальний запуск:

1️⃣ Клонувати репозиторій:
git clone https://github.com/AndriiShaposhnyk/cv-generator.git
cd cv-generator

2️⃣ Встановити залежності:  
npm install 

3️⃣ Створити файл .env у корені проєкту:
і вставити свій Hugging Face токен у форматі: HF_API_KEY=hf_XXXXXXXXXXXXXXXXXXXXXXXXX
⚠️ Файл .env не потрібно комітити у GitHub — він уже доданий у .gitignore.

4️⃣ Запустити фронтенд:
npm run dev 

5️⃣Запустити бекенд: 
npm run server:dev 

Після запуску обох серверів відкрити локально і заповнити форму - після надсилання згенерується .docx файл.

🚀 Функціональність:
- Форма для введення особистих даних (ім’я, email, телефон, місто, навички, досвід, опис тощо)
- Генерація DOCX-файлу з форматованим резюме
- Опціонально: використання AI (LLM API) для покращення тексту (секція about yourself)
- Якщо AI-редагування недоступне, застосовується стандартна логіка — користувач усе одно отримує свій файл

🧰 Технології:
- Frontend: React + TypeScript 
- Backend: Node.js + Express + TypeScript
- AI integration: Hugging Face Inference API (модель google/gemma-2-2b-it через chatCompletion API)

🤖 Модуль AI (aiPolish.ts):
Модуль aiPolish.ts відповідає за інтеграцію з Hugging Face Chat API.
Мета — отримати від моделі “відредаговану” професійну версію тексту з поля About Yourself.
Логіка роботи:
- Отримує текст із форми (наприклад, поле “About Yourself”).
- Відправляє його до LLM-моделі (google/gemma-2-2b-it) через hf.chatCompletion().
- Модель повертає “відредаговану” англомовну версію у професійному CV-стилі.
- Якщо запит не проходить — застосовується fallback (оригінальний текст із мінімальним очищенням).

🧩 Як вирішено проблему з 404 / InputError
🔍 Симптом: 
При зверненні до моделей (mistralai/Mistral-7B-Instruct-v0.2, google/flan-t5-large, falcon-7b-instruct тощо)
Hugging Face API повертав помилку 404 “Not Found” або InputError. 

⚙️ Діагностика: 
- Перевірено: токен HF_API_KEY працює (успішна авторизація через /api/whoami-v2).
- Проблема не у ключі, а у типі завдання (task), який підтримує конкретна модель.
- Виявлено, що більшість моделей у Hugging Face не розгорнуті для text-generation через офіційний API,
або підтримують лише conversational режим (чат).

💡 Рішення:
- Перехід із textGeneration() на chatCompletion().
- Проблема з 404 повністю зникла.

💡 Висновок:
🟢 Основна логіка застосунку працює стабільно
🧠 AI-модуль оновлено до формату chatCompletion, що забезпечує сумісність з актуальними моделями Hugging Face
🌐 404-помилка вирішена — виклики тепер проходять через auto-провайдер
☁️ На хмарному сервері (Vercel/Render) інтеграція працюватиме ще стабільніше


🧑‍💻 Автор
Andrii Shaposhnyk
andrii.shaposhnyk@gmail.com
