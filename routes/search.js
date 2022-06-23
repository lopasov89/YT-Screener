const router = require('express').Router()
const { Search } = require('../db/models')

router.post('/', async (req, res) => {
  // console.log('req.body==>',req.body)
  const { query, amount, order } = req.body
  await Search.create({
    query, amount, order, user_id: req.session.userId,
  })
  res.redirect('/')
})

module.exports = router
