const movieForm = document.querySelector('#movie-form');
const movieMessage = document.querySelector('#movie-res');

movieForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  //reset errors
  movieMessage.textContent = '';

  // get the values
  const name = movieForm.name.value;
  const overview = movieForm.overview.value;
  const isPublic = movieForm.isPublic.value == 'true' ? true : false;

  try {
    const res = await fetch('/new-movie', {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        overview: overview,
        isPublic: isPublic,
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
      movieMessage.textContent = data.message;
      movieMessage.style.color = 'green';
      //reset forms
      movieForm.name.value = '';
      movieForm.overview.value = '';
    }
  } catch (err) {
    console.log(err);
    location.replace('/new-movie');
  }
});
