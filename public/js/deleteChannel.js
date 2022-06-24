// ! Находим наш блок со всеми карточками
const ytStatBlock = document.querySelector('#ytStat')

ytStatBlock?.addEventListener('click', async (event) => {
  const { id } = event.target.dataset

  if (id) {
    const response = await fetch('/channels', {
      method: 'DELETE',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ id }),
    })

    if (response.ok) {
      const card = event.target.closest('.mb-3') // нашли ближайшего родителя с атрибутом .card для события клик
      card.remove() // удалили родителя = конкретную карточку
    }
  }
})
