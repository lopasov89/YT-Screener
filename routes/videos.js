/* eslint-disable no-restricted-syntax */
const router = require('express').Router()
const fs = require('fs').promises
const path = require('path') // подключили модуль path
const { Search, Result } = require('../db/models')

router.get('/', async (req, res) => {
  res.render('videoSearch')
})

router.post('/', async (req, res) => {
  // ! Достаем из тела запроса необходимые данные
  const { query, amount, order, items } = req.body

  // ! Достаем все поиски из папки и забираем имя последнего для записи в базу
  const searchFiles = await fs.readdir(path.join(process.env.PWD, 'public', 'searches'))
  const link = `/searches/searchID:${searchFiles.length + 1}-searchPhrase:${query.toUpperCase()}.csv`

  // ! Заносим в базу поиск
  const currentSearch = await Search.create({
    query,
    amount,
    order,
    link,
    user_id: req.session.userId,
  })

  // ! Заносим в базу результаты поиска
  for await (let item of items) {
    await Result.create({
      title: item.snippet.title,
      videoId: item.id.videoId,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      views: item.views,
      likes: item.likes,
      comments: item.comments,
      download: item.snippet.publishedAt.slice(0, 10),
      search_id: currentSearch.id,
    })
  }

  // ! Создаем csv файл с отчетом
  const results = await Result.findAll(({ where: { search_id: currentSearch.id }, raw: true }))

  let stringStat = ''
  for (let i = 0; i < results.length; i++) {
    if (i === 0) {
      stringStat += 'Video ID; Title; URL; Views; Likes; Comments; Download \n'
    }
    stringStat += `${results[i].videoId}; ${results[i].title}; ${results[i].url}; ${results[i].views}; ${results[i].likes}; ${results[i].comments}; ${results[i].download}\n`
  }

  const fileCurrentStat = `/searches/searchID:${currentSearch.id}-searchPhrase:${currentSearch.query.toUpperCase()}.csv`
  await fs.writeFile(path.join(process.env.PWD, 'public', `${fileCurrentStat}`), stringStat)

  // ! Отправляем на фронт путь до файла
  res.json({ fileCurrentStat })
})

router.delete('/', async (req, res) => {
  const { id } = req.body

  // ! Нахожу все поиски и забираю id поледнего
  const allSearches = await Search.findAll({ raw: true })
  const lastSearch = allSearches[allSearches.length - 1]

  // ! Нахожу нужный результат и удаляю из таблицы
  const deleteCard = await Result.findOne({ where: { videoId: id, search_id: lastSearch.id } })
  deleteCard.destroy()

  // ! Перезаписываю данные в текущем отчете
  const results = await Result.findAll(({ where: { search_id: lastSearch.id }, raw: true }))

  let stringStat = ''
  for (let i = 0; i < results.length; i++) {
    if (i === 0) {
      stringStat += 'Video ID; Title; URL; Views; Likes; Comments; Download \n'
    }
    stringStat += `${results[i].videoId}; ${results[i].title}; ${results[i].url}; ${results[i].views}; ${results[i].likes}; ${results[i].comments}; ${results[i].download}\n`
  }
  const fileCurrentStat = `/searches/searchID:${lastSearch.id}-searchPhrase:${lastSearch.query.toUpperCase()}.csv`
  await fs.writeFile(path.join(process.env.PWD, 'public', `${fileCurrentStat}`), stringStat)

  // ! Отправляю на фронт ответ
  res.sendStatus(200)
})

module.exports = router
