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
- Опціонально: використання AI (LLM API) для покращення тексту (about yourself, skills)
- Якщо AI-редагування недоступне, застосовується стандартна логіка — користувач усе одно отримує свій файл

🧰 Технології:
- Frontend: React
- Backend: Node.js + Express + TypeScript
- AI integration: Hugging Face Inference API

🤖 Модуль AI:
У проєкті я реалізував модуль aiPolish.ts, який звертається до "https://api-inference.huggingface.co/models/google/gemma-2-2b-it" (модель, яка повинна повертати відредагований текст). 

🧩 Висновок: 
- Базова генерація резюме працює стабільно. 
- AI-частина реалізована

🧑‍💻 Автор
Andrii Shaposhnyk
andrii.shaposhnyk@gmail.com
