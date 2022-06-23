const router = require('express').Router()
const bcrypt = require('bcrypt')
const { User } = require('../db/models')
const { checkIsSession, checkIsNotSession } = require('../middlewares/check.middleware')
const mailer = require('../middlewares/mailer.middleware');

const saltRounds = 10

router.get('/register', checkIsSession, (req, res) => {
  res.render('register')
})

router.post('/register', async (req, res) => {
  const { name, email, password } = req.body
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  try {
    // для проверки что юзера с такой почтой нет в базе - обращаемся к базе
    const user = await User.findOne({
      where: {
        email,
      },
    })
    // если юзер с такой почтой найден - то показать страницу с ошибкой
    if (user) {
      return res.render('error', {
        message: 'E-mail уже существует',
        error: {},
      })
    }
    // иначе создать нового
    const newUser = await User.create({
      name, email, password: hashedPassword,
    })
    // ! сессия создастся здесь
    req.session.userName = newUser.name // добавляем в сессию имя нового юзера
    req.session.userId = newUser.id // добавляем в сессию id найденного юзер

    // ! тут начинается логика отправки сообщения
    const message = {
      to: email,
      subject: 'Добро пожаловать в сервис YT Screener',
      html: `
        <h2>${name}, поздравляем, Вы успешно зарегистрировались на нашем сайте!</h2>
        
        <i>Ваш логин: ${email}</i>
        <i>Ваш пароль: ${password}</i>
        `,
    }
    mailer(message)

    res.redirect('/')
  } catch (error) {
    return res.render('error', {
      message: 'Не удалось зарегистрироваться',
      error: {},
    })
  }
})

router.get('/login', checkIsSession, (req, res) => {
  res.render('login')
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body
  try {
    const user = await User.findOne({
      where: {
        email,
      },
    })
    // если юзера с таким эмайлом нет еще в базе то показать страницу с ошибкой
    if (!user) {
      return res.render('error', {
        message: 'Неверный e-mail',
        error: {},
      })
    }
    // сверяем введенный пароль с паролем в базе
    const isValidPass = await bcrypt.compare(password, user.password)
    // если пароли не совпали то сгенерировать ошибку
    if (!isValidPass) {
      return res.render('error', {
        message: 'Неверный пароль',
        error: {},
      })
    }
    // ! Если почта есть в базе и пароли совпали то
    // ! сессия создастся здесь
    req.session.userName = user.name // добавляем в сессию имя найденного юзера
    req.session.userId = user.id // добавляем в сессию id найденного юзера
    res.redirect('/')
  } catch (error) {
    res.redirect('/user/login')
  }
})

router.get('/logout', checkIsNotSession, (req, res) => {
  req.session.destroy() // ! убиваем сессию
  res.clearCookie(process.env.COOKIE_NAME) // ! убираем из куки id сессии
  res.redirect('/user/login')
})

module.exports = router
