require('dotenv').config() // импортировали dotenv

const express = require('express') // импортировали экспресс
const path = require('path') // импортировали модуль path
const hbs = require('hbs') // импортировали hbs

const app = express() // создали экземпляр сервера
const PORT = process.env.PORT || 3000 // создали константу с портом

app.set('view engine', 'hbs') // устанавливаем движок визуализации hbs
app.set('views', path.join(process.env.PWD, 'views')) // прописываем путь до папки с hbs

hbs.registerPartials(path.join(process.env.PWD, 'views', 'partials')) // прописываем путь до partials (если используем)

app.use(express.static(path.join(process.env.PWD, 'public'))) // прописываем путь до папки public с пользовательскими скриптами, стилями и т.д
app.use(express.urlencoded({ extended: true })) // учим экспресс читать тела запросов
app.use(express.json()) // учим экспресс читать json формат

app.listen(PORT, () => { // начинаем слушать сервер на указанном порте
  console.log(`Сервер запущен на порте ${PORT}`)
})
