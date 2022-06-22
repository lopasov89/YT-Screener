console.log('Клиентский скрипт')

const ytFormSearch = document.querySelector('#formSearch')
const ytStat = document.querySelector('#ytStat')

const youtubeKey = 'AIzaSyBS2ou8hU1X0_KsF2dYzJZaysBfcHIrfkU'

ytFormSearch.addEventListener('submit', async (event) => {
  event.preventDefault()
  const phrase = event.target.phrase.value
  const number = event.target.number.value || 5
  const order = event.target.order.value

  // console.log('phrase, number, order===>', phrase, number, order)
  const responseToSearch = await fetch(`https://youtube.googleapis.com/youtube/v3/search?part=snippet&q=${phrase}&maxResults=${number}&type=video&key=${youtubeKey}&safeSearch=none&order=${order}`)
  const resultToSearch = await responseToSearch.json()

  // console.log(resultToSearch)

  if (resultToSearch.items && resultToSearch.items.length > 0) {
    for (let i = 0; i < resultToSearch.items.length; i++) {
      const responseToStatistic = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${resultToSearch.items[i].id.videoId}&key=${youtubeKey}`)
      const resultToStatistic = await responseToStatistic.json()
      // console.log(resultToStatistic);
      const resSearch = `<div class="card mb-3" style="max-width: 540px;">
      <div class="row g-0">
        <div class="col-md-4">
          <a href="https://www.youtube.com/watch?v=${resultToSearch.items[i].id.videoId}" target="_blank"> <img src="${resultToSearch.items[i].snippet.thumbnails.medium.url}" class="img-fluid rounded-start" alt="${resultToSearch.items[i].snippet.title}"></a>
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">${resultToSearch.items[i].snippet.title}</h5>
            <p class="card-text">Views: ${resultToStatistic.items[0].statistics.viewCount}</p>
            <p class="card-text">Likes: ${resultToStatistic.items[0].statistics.likeCount}</p>
            <p class="card-text">Comments: ${resultToStatistic.items[0].statistics.commentCount}</p>
            <p class="card-text"><small class="text-muted">Created at: ${resultToSearch.items[i].snippet.publishedAt.slice(0, 10)}</small></p>
          </div>
        </div>
      </div>
    </div>`
      ytStat.insertAdjacentHTML('beforeend', resSearch)
    }
  }
})
