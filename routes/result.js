const router = require('express').Router()
const { Result, Search } = require('../db/models')

router.post('/', async (req, res) => {
  // console.log('req.body==>', req.body)
  // ! Принимаю массив с объектами
  const results = req.body
  // console.log('results==>', results)
  // ! Нахожу все поиски и забираю id поледнего
  const allSearches = await Search.findAll({ raw: true })
  const { id } = allSearches[allSearches.length - 1]
  // console.log('id===>', id);
  for (let i = 0; i < results.length; i++) {
    await Result.create({ 
      title: results[i].snippet.title,
      url: `https://www.youtube.com/watch?v=${results[i].id.videoId}`,
      views: results[i].views,
      likes: results[i].likes,
      comments: results[i].comments,
      download: results[i].snippet.publishedAt.slice(0, 10),
      search_id: id,
    })
  }
  res.redirect('/')
})

module.exports = router
