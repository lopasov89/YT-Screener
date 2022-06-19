1. Инициализируем проект + устанавливаем все необходимые пакеты

npm init -y || npm i
npx eslint --init
npm i -D nodemon
npm i express morgan dotenv hbs sequelize sequelize-cli pg pg-hstore bcrypt express-session session-file-store multer moment

2. добавляем правила в eslint  
'no-console': 0,
semi: ['error', 'never'],

3. Добавляем в игнорирование node modules и sessions/
npx gitignore node 

4. Добавляем запуск приложения по командам в packet.json
"start": "node app.js",
"dev": "nodemon app.js"

5. Редактируем файл .env - заносим актуальный порт для сервера и данные для БД

6. Добавляем файл app.js и заполняем его

7. Создаем папку views и в ней файл layout.hbs
7.1 Наполняем layout.hbs стандартной разметкой + {{{body}}}
7.2 Можно подключить к layout.hbs - Bootstrap

8. Также в проекте могут понадобиться папки "partials", "public" (пути прописываются в app.js)

9. БД инициализируем 
npx sequelize init
9.1 Создаем базу 
npx sequelize db:create 
9.2 Создаем модели
npx sequelize model:generate --name Post --attributes title:string,image_url:string
9.3 Прописываем внешние ключи и настройки полей в моделях
9.4 Прописываем ассоциации в миграциях
9.5 Накатываем миграции
npx sequelize db:migrate 
9.6 Проверяем БД в beekeeper

10. Чтобы все обработчики были логично распредены по сущностям - их лучше вынести в отдельные файлы, которые поместить в папку "routes" (создав ее)
10.1 Начинаем прописывать обработчики (ручки) запросов. 
10.2 Если используем обработчики из папки rotes - незабываем их оттуда экспортировать и импортировать уже в файле app.js, указав в нем затем на какой файл ссылаться

