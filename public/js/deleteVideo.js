// ! Находим наш блок со всеми карточками
const ytStatBlock = document.querySelector('#ytStat')

ytStatBlock?.addEventListener('click', async (event) => {
  const { id } = event.target.dataset
  try {
    if (id) {
      const response = await fetch('/videos', {
        method: 'DELETE',
        headers: {
          'Content-type': 'application/json',
        },
        body: JSON.stringify({ id }),
      })

      if (response.ok) {
        const card = event.target.closest('.mt-3') // нашли ближайшего родителя с атрибутом .card для события клик
        card.remove() // удалили родителя = конкретную карточку
      }
    }
  } catch (error) {
    console.log('error', error)
  }
})
