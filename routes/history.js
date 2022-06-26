const router = require('express').Router()
const { Search } = require('../db/models')
const { checkIsNotSession } = require('../middlewares/check.middleware')

router.get('/', checkIsNotSession, async (req, res) => {
  try {
    const allSearches = await Search.findAll({ raw: true })
    res.render('mySearches', { allSearches })
  } catch (error) {
    return res.render('error', {
      message: 'Failed to load search history',
      error: {},
    })
  }
})

module.exports = router
