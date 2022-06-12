// ! Импортируем библиотеки
require('dotenv').config() // подключили dotenv
const express = require('express') // подключили экспресс
const createError = require('http-errors') // подключили обработку ошибок
const path = require('path') // подключили модуль path
const hbs = require('hbs') // подключили hbs
const logger = require('morgan') // подключили логгер morgan

// ! Импортируем созданные в отдельный файлах роуты.
// -->Тут пишем require роутов<--

// ! Инициализируем приложение
const app = express() // создали экземпляр сервера
const PORT = process.env.PORT || 3000 // создали константу с портом

// ! Устанавливаем шаблонизатор
app.set('view engine', 'hbs') // Сообщаем express, что в качестве шаблонизатора используется "hbs".
app.set('views', path.join(process.env.PWD, 'views')) // Сообщаем express путь до папки с шалонами hbs
hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials')) // Сообщаем express, что шаблона шаблонизаторая (вью) находятся в папке "ПапкаПроекта/views".

// ! Подключаем миддлварки
app.use(morgan('dev')) // Подключаем middleware morgan с режимом логирования "dev", чтобы для каждого HTTP-запроса на сервер в консоль выводилась информация об этом запросе.
app.use(express.static(path.join(process.env.PWD, 'public'))) // Подключаем middleware, которое сообщает epxress, что в папке "ПапкаПроекта/public" будут находится статические файлы, т.е. файлы доступные для скачивания из других приложений.
app.use(express.urlencoded({ extended: true })) //Подключаем middleware, которое позволяет читать содержимое body из HTTP-запросов типа POST, PUT и DELETE.
app.use(express.json()) // Подключаем middleware, которое позволяет читать переменные JavaScript, сохранённые в формате JSON в body HTTP-запроса.

// ! -->Тут пишем роуты<--

// ! Обработка ненайденных страниц
// Если HTTP-запрос дошёл до этой строчки, значит ни один из ранее встречаемых рутов не
// ответил на запрос. Это значит, что искомого раздела просто нет на сайте. Создаём небольшое middleware, которое отображает страницу с ошибкой
app.get('*', (req, res) => {
  res.render('error')
})

// ! Начинаем слушать порт для запуска сервера
app.listen(PORT, () => { // начинаем слушать сервер на указанном порте
  console.log(`Сервер запущен на порте ${PORT}`)
})
