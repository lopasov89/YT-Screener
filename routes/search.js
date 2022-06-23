/* eslint-disable no-restricted-syntax */
const router = require('express').Router()
const { Search, Result } = require('../db/models')
const fs = require('fs').promises

router.post('/', async (req, res) => {
  // ! Достаем из тела запроса необходимые данные
  const { query, amount, order, items } = req.body

  // ! Заносим в базу поиск
  const currentSearch = await Search.create({
    query, amount, order, user_id: req.session.userId,
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
  console.log('results==>', results)
  let stringStat = ''
  results.forEach((element) => {
    stringStat += `Video ID: ${element.videoId}, Title: ${element.title}, URL: ${element.url}, Views: ${element.views}, Likes: ${element.likes}, Comments: ${element.comments}, Download: ${element.download}\n`
  })
  const fileCurrentStat = `/searches/searchId:${currentSearch.id}-searchPhrase:${currentSearch.query.toUpperCase()}.csv`
  await fs.writeFile(`./public${fileCurrentStat}`, stringStat)
  res.sendStatus(200)
})

router.delete('/', async (req, res) => {
  const { id } = req.body
  // ! Нахожу все поиски и забираю id поледнего
  const allSearches = await Search.findAll({ raw: true })
  const lastSearchId = allSearches[allSearches.length - 1].id

  // ! Нахожу нужный результат и удаляю из таблицы
  const deleteCard = await Result.findOne({ where: { videoId: id, search_id: lastSearchId } })
  deleteCard.destroy()
  res.sendStatus(200)
})

module.exports = router
