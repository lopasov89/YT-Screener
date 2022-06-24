// console.log('Клиентский скрипт поиска')
// ! Находим нашу форму
const ytFormSearch = document.querySelector('#formSearch')

// !Находим наш блок куда будем вставлять карточки
const ytStat = document.querySelector('#ytStat')

const youtubeKey = 'AIzaSyBS2ou8hU1X0_KsF2dYzJZaysBfcHIrfkU'

// ! Начинаем слушать событие
ytFormSearch?.addEventListener('submit', async (event) => {
  event.preventDefault()

  // ! Очищаем предыдущие результаты поиска
  ytStat.innerHTML = ''

  // ! Удаляем кнопку скачивания статистики
  if (document.querySelector('#btn-save')) {
    document.querySelector('#btn-save').remove()
  }

  // ! Собираем данные из полей ввода
  const query = event.target.query.value
  const amount = event.target.amount.value || 5
  const order = event.target.order.value

  // ! Отправляем запрос на поиск подходящих видео
  const responseToSearch = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${amount}&type=video&key=${youtubeKey}&safeSearch=none&order=${order}`)

  // ! Получаем ответ от сервера Youtube
  const resultToSearch = await responseToSearch.json()
  // console.log('resultToSearch1===>', resultToSearch)

  // ! Дальше нужно собрать статистику по каждому видео + отрисовать карточки

  if (resultToSearch.items && resultToSearch.items.length > 0) {
    for (let i = 0; i < resultToSearch.items.length; i++) {
      // ! Отправляем запрос по API для получения статистики по каждому видео
      const responseToStatistic = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${resultToSearch.items[i].id.videoId}&key=${youtubeKey}`)

      // ! Получаем ответ от сервера Youtube
      const resultToStatistic = await responseToStatistic.json()
      // console.log(resultToStatistic);
      // ! Добавляем в объекты с видео данные о статистике
      resultToSearch.items[i].views = resultToStatistic.items[0].statistics.viewCount
      resultToSearch.items[i].likes = resultToStatistic.items[0].statistics.likeCount || '0'
      resultToSearch.items[i].comments = resultToStatistic.items[0].statistics.commentCount || '0'

      // ! Отрисовываем карточку по каждому видео
      const resSearch = `<div class="card mb-3 ${resultToSearch.items[i].id.videoId}" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <a href="https://www.youtube.com/watch?v=${resultToSearch.items[i].id.videoId}" target="_blank"> <img src="${resultToSearch.items[i].snippet.thumbnails.medium.url}" class="img-fluid rounded-start" alt="${resultToSearch.items[i].snippet.title}"></a>
          <button data-id=${resultToSearch.items[i].id.videoId} type="button" class="btn btn-danger deleteButton">Delete</button>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${resultToSearch.items[i].snippet.title}</h5> <br>
            <p class="card-text">Views: ${resultToStatistic.items[0].statistics.viewCount}</p>
            <p class="card-text">Likes: ${resultToStatistic.items[0].statistics.likeCount || '0'}</p>
            <p class="card-text">Comments: ${resultToStatistic.items[0].statistics.commentCount || '0'}</p>
            <p class="card-text"><small class="text-muted">Created at: ${resultToSearch.items[i].snippet.publishedAt.slice(0, 10)}</small></p>
          </div>
        </div>
      </div>`
      ytStat.insertAdjacentHTML('beforeend', resSearch)
    }
  }
  // ! Вытягиваем массив объектов результатов поиска
  const { items } = resultToSearch
  // ! Отправляем fetch для занесения поиска и результатов в базу
  const response = await fetch('/videos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      query, amount, order, items,
    }),
  })
  // ! Получаем ответ с бэка
  if (response.ok) {
    const result = await response.json()
    const { fileCurrentStat } = result
    // ! Добавляем кнопку скачивания результатов текущего поиска
    const linkList = document.createElement('a')
    linkList.href = fileCurrentStat
    linkList.id = 'btn-save'
    linkList.classList.add('btn')
    linkList.classList.add('btn-info')
    linkList.innerText = 'Save statistics(csv)'
    // ! Вставляем кнопку на страницу
    ytStat.before(linkList)
  }
})
