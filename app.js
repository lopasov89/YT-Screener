// ! Импортируем библиотеки
require('dotenv').config() // подключили dotenv
const express = require('express') // подключили экспресс
const path = require('path') // подключили модуль path
const hbs = require('hbs') // подключили hbs
const morgan = require('morgan') // подключили логгер morgan
const session = require('express-session'); // подключили модуль для работы с сессиями
const FileStore = require('session-file-store')(session); // подключили модуль для хранения сессий
const dbCheck = require('./db/dbCheck'); // подключение скрипта проверки соединения с БД

// ! Импортируем созданные в отдельный файлах роуты.
// -->Тут пишем require роутов<--

// ! Инициализируем приложение
const app = express() // создали экземпляр сервера
const PORT = process.env.PORT || 3002 // создали константу с портом
dbCheck(); // вызов функции проверки соединения с базоый данных

// ! Задаем конфигурацию для работы с сессиями
const sessionConfig = {
  store: new FileStore(), // хранилище сессий
  key: process.env.COOKIE_NAME, // ключ куки
  secret: process.env.SECRET, // шифрование id сессии
  resave: false, // пересохранение сессии (когда что-то поменяли - false)
  saveUninitialized: false, // сохраняем только зарегестрированных
  httpOnly: true, // нельзя изменить куки с фронта
  cookie: { expires: 24 * 60 * 60e3 }, // устанавливаем срок хранения
}

// ! Устанавливаем шаблонизатор
app.set('view engine', 'hbs') // Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('views', path.join(process.env.PWD, 'views')) // Сообщаем express путь до папки с шалонами hbs
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials')) // Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".

// ! Подключаем миддлварки
app.use(morgan('dev')) // Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(express.static(path.join(process.env.PWD, 'public'))) // Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.urlencoded({ extended: true })) // Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.json()) // Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.
app.use(session(sessionConfig)) // Подключаем middleware для использования сессий в приложений и передаем ей конфигурацию 

// ! мидлварка для того чтобы присвоить локальной переменной имя и id юзера из сессии
app.use((req, res, next) => {
  if (req.session.userId) {
    res.locals.userName = req.session.userName
    res.locals.userId = req.session.userId
  }
  next()
})

// ! Подключаем обработку запросов
// -->Тут пишем роуты<--

// ! Обработка ненайденных страниц
// Если HTTP-запрос дошёл до этой строчки, значит ни один из ранее встречаемых рутов не ответил на запрос. 
// Это значит, что искомого раздела просто нет на сайте.
// Создаём небольшое middleware, которое отображает страницу с ошибкой
app.get('*', (req, res) => {
  res.render('error', {
    message: 'Такой страницы не существует',
    error: {},
  })
})

// ! Начинаем слушать порт для запуска сервера
app.listen(PORT, () => { 
  console.log(`Сервер запущен на порте ${PORT}`)
})
