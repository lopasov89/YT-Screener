const router = require('express').Router()
const { Search } = require('../db/models')
const { checkIsNotSession } = require('../middlewares/check.middleware')

router.get('/', checkIsNotSession, async (req, res) => {
  const allSearches = await Search.findAll({ raw: true })
  res.render('mySearches', { allSearches })
})

module.exports = router
