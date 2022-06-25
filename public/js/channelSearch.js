// ! Находим нашу форму
const ytFormSearch = document.querySelector('#formSearch')

// !Находим наш блок куда будем вставлять карточки
const ytStat = document.querySelector('#ytStat')

const youtubeKey = 'AIzaSyCqKBbGra_1Sb4TFcdQqQMLu8lqbg-gPvo'

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
  const responseToSearch = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${amount}&type=channel&key=${youtubeKey}&safeSearch=none&order=${order}`)

  // ! Получаем ответ от сервера Youtube
  const resultToSearch = await responseToSearch.json()
  // ! Дальше нужно собрать статистику по каждому видео + отрисовать карточки

  if (resultToSearch.items && resultToSearch.items.length > 0) {
    for (let i = 0; i < resultToSearch.items.length; i++) {
      // ! Отправляем запрос по API для получения статистики по каждому видео
      const responseToStatistic = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics,snippet&id=${resultToSearch.items[i].id.channelId}&key=${youtubeKey}`)

      // ! Получаем ответ от сервера Youtube
      const resultToStatistic = await responseToStatistic.json()

      // ! Добавляем в объекты с видео данные о статистике
      resultToSearch.items[i].subscribers = resultToStatistic.items[0].statistics.subscriberCount || '0'
      resultToSearch.items[i].videos = resultToStatistic.items[0].statistics.videoCount || '0'
      resultToSearch.items[i].views = resultToStatistic.items[0].statistics.viewCount || '0'
      resultToSearch.items[i].customUrl = resultToStatistic.items[0].snippet.customUrl || resultToSearch.items[i].id.channelId

      let link
      if (resultToStatistic.items[0].snippet.customUrl) {
        link = `<a href="https://www.youtube.com/c/${resultToStatistic.items[0].snippet.customUrl}" target="_blank">`
      } else {
        link = ''
      }

      // ! Отрисовываем карточку по каждому видео
      const resSearch = `<div class="card mt-3 mx-auto ${resultToSearch.items[i].id.channelId}" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
        ${link}
           <img src="/images/youtube.jpeg" class="img-fluid rounded-start mt-3" alt="${resultToSearch.items[i].snippet.title}"></a>
           <div>
          <button data-id=${resultToSearch.items[i].id.channelId} type="button" class="btn btn-danger deleteButton mt-2">Delete</button>
          </div>
        </div>
        <div class="col-md-8">
          <div class="card-body">
          ${link} <h5 class="card-title">${resultToSearch.items[i].snippet.title}</h5></a> <br>
            <p class="card-text">Subscribers: ${resultToStatistic.items[0].statistics.subscriberCount || '0'}</p>
            <p class="card-text">Videos: ${resultToStatistic.items[0].statistics.videoCount || '0'}</p>
            <p class="card-text">Views: ${resultToStatistic.items[0].statistics.viewCount || '0'}</p>
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
  const response = await fetch('/channels', {
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
    linkList.classList.add('btn-success')
    linkList.innerText = 'Save statistics(csv)'
    // ! Вставляем кнопку на страницу
    ytStat.after(linkList)
  }
})
