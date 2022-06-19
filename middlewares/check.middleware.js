// проверка на то есть ли у юзера сессия
const checkIsSession = (req, res, next) => {
  if (req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}
// проверка на то нет ли у юзера сессия
const checkIsNotSession = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/')
  } else {
    next()
  }
}

module.exports = {
  checkIsSession, checkIsNotSession,
}
