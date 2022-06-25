/* eslint-disable no-restricted-syntax */
const router = require('express').Router()
const fs = require('fs').promises
const path = require('path') // подключили модуль path
const { Search, Result } = require('../db/models')
const { checkIsNotSession } = require('../middlewares/check.middleware')

router.get('/', checkIsNotSession, async (req, res) => {
  res.render('channelSearch')
})

router.post('/', async (req, res) => {
  // ! Достаем из тела запроса необходимые данные
  const { query, amount, order, items } = req.body

  // ! Достаем все поиски из папки и забираем имя последнего для записи в базу
  const searchFiles = await fs.readdir(path.join(process.env.PWD, 'public', 'searches'))
  const link = `/searches/searchID:${searchFiles.length + 1}-searchPhrase:${query.toUpperCase()}.csv`

  // ! Заносим в базу поиск
  const currentSearch = await Search.create({
    type: 'CHANNEL',
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
      channelId: item.id.channelId,
      url: `https://www.youtube.com/c/${item.customUrl}`,
      views: item.views,
      subscribers: item.subscribers,
      videos: item.videos,
      created: item.snippet.publishedAt.slice(0, 10),
      search_id: currentSearch.id,
    })
  }

  // ! Создаем csv файл с отчетом
  const results = await Result.findAll(({ where: { search_id: currentSearch.id }, raw: true }))

  let stringStat = ''
  for (let i = 0; i < results.length; i++) {
    if (i === 0) {
      stringStat += 'Channel ID; Title; URL; Subscribers; Videos; Views; Created \n'
    }
    stringStat += `${results[i].channelId}; ${results[i].title}; ${results[i].url}; ${results[i].subscribers}; ${results[i].videos}; ${results[i].views}; ${results[i].created}\n`
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
  const deleteCard = await Result.findOne({ where: { channelId: id, search_id: lastSearch.id } })
  deleteCard.destroy()

  // ! Перезаписываю данные в текущем отчете
  const results = await Result.findAll(({ where: { search_id: lastSearch.id }, raw: true }))

  let stringStat = ''
  // for (let i = 0; i <= results.length; i++) {
  //   if (i === 0) {
  //     stringStat += 'Channel ID; Title; URL; Subscribers; Videos; Views; Views \n'
  //   }
  //   stringStat += `${results[i].channelId}; ${results[i].title}; ${results[i].url}; ${results[i].subscribers}; ${results[i].videos}; ${results[i].views}; ${results[i].created}\n`
  // }
  results.forEach((element) => {
    stringStat += `Channel ID: ${element.channelId}, Title: ${element.title}, URL: ${element.url}, Subscribers: ${element.subscribers}/${element.scetch}, Videos: ${element.videos}, Views: ${element.views}, Views: ${element.created}\n`
  })

  const fileCurrentStat = `/searches/searchID:${lastSearch.id}-searchPhrase:${lastSearch.query.toUpperCase()}.csv`
  await fs.writeFile(path.join(process.env.PWD, 'public', `${fileCurrentStat}`), stringStat)

  // ! Отправляю на фронт ответ
  res.sendStatus(200)
})

module.exports = router
