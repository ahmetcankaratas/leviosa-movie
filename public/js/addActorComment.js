const movieForm = document.querySelector('#movie-form');
const movieMessage = document.querySelector('#movie-res');
const movieId = document.querySelector('#id');
// const likeForm = document.querySelector('#like-form');
// const likeMessage = document.querySelector('#like-form');

movieForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  //reset errors
  movieMessage.textContent = '';

  // get the values
  const title = movieForm.title.value;
  const text = movieForm.text.value;
  const id = movieId.value;

  try {
    const res = await fetch(`/actor/${id}/comments`, {
      method: 'POST',
      body: JSON.stringify({
        title: title,
        text: text,
      }),
      // body data type must match "Content-Type" header
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await res.json();

    if (data.errors) {
      movieMessage.textContent = data.errors;
      movieMessage.style.color = 'red';
    }
    if (data.message) {
      location.replace(`/actor/${id}`);
    }
  } catch (err) {
    console.log(err);
    location.replace(`/actor/${id}`);
  }
});
