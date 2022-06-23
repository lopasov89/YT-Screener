console.log('Клиентский скрипт')

const ytFormSearch = document.querySelector('#formSearch')
const ytStat = document.querySelector('#ytStat')

const youtubeKey = 'AIzaSyCqKBbGra_1Sb4TFcdQqQMLu8lqbg-gPvo'

ytFormSearch.addEventListener('submit', async (event) => {
  event.preventDefault()

  // ! Собираем данные из полей ввода
  const query = event.target.query.value
  const amount = event.target.amount.value || 5
  const order = event.target.order.value

  // ! Отправляем запрос на поиск подходящих видео
  const responseToSearch = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${query}&maxResults=${amount}&type=video&key=${youtubeKey}&safeSearch=none&order=${order}`)

  // ! Получаем ответ от сервера Youtube
  const resultToSearch = await responseToSearch.json()
  // console.log('resultToSearch1===>', resultToSearch)

  // ! Дальше нужно собрать статисстику по каждому видео + отрисовать карточки

  if (resultToSearch.items && resultToSearch.items.length > 0) {
    for (let i = 0; i < resultToSearch.items.length; i++) {
      // ! Отправляем запрос по API для получения статистики по каждому видео
      const responseToStatistic = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${resultToSearch.items[i].id.videoId}&key=${youtubeKey}`)

      // ! Получаем ответ от сервера Youtube
      const resultToStatistic = await responseToStatistic.json()
      // console.log(resultToStatistic);
      // ! Добавляем в объекты с видео данные о статистике
      resultToSearch.items[i].views = resultToStatistic.items[0].statistics.viewCount;
      resultToSearch.items[i].likes = resultToStatistic.items[0].statistics.likeCount;
      resultToSearch.items[i].comments = resultToStatistic.items[0].statistics.commentCount || 'unknown';

      // ! Отрисовываем карточку по каждому видео
      const resSearch = `<div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <a href="https://www.youtube.com/watch?v=${resultToSearch.items[i].id.videoId}" target="_blank"> <img src="${resultToSearch.items[i].snippet.thumbnails.medium.url}" class="img-fluid rounded-start" alt="${resultToSearch.items[i].snippet.title}"></a>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${resultToSearch.items[i].snippet.title}</h5> <br>
            <p class="card-text">Views: ${resultToStatistic.items[0].statistics.viewCount}</p>
            <p class="card-text">Likes: ${resultToStatistic.items[0].statistics.likeCount}</p>
            <p class="card-text">Comments: ${resultToStatistic.items[0].statistics.commentCount || 'unknown'}</p>
            <p class="card-text"><small class="text-muted">Created at: ${resultToSearch.items[i].snippet.publishedAt.slice(0, 10)}</small></p>
          </div>
        </div>
      </div>
    </div>`
      ytStat.insertAdjacentHTML('beforeend', resSearch)
    }
  }
  // console.log('resultToSearch2===>', resultToSearch)
  // ! Отправляем fetch для занесения поиска в базу
  await fetch('/search', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query, amount, order }),
  })

  // ! Отправляем fetch для занесения результатов поиска в базу
  const { items } = resultToSearch
  // console.log('resultToSearch===>', resultToSearch);
  await fetch('/result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(items),
  })
})
