const router = require('express').Router()
const { Search } = require('../db/models')

router.get('/', async (req, res) => {
  const allSearches = await Search.findAll({ raw: true })
  res.render('mySearches', { allSearches })
})

module.exports = router
