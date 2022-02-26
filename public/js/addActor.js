const movieForm = document.querySelector('#movie-form');
const movieMessage = document.querySelector('#movie-res');

movieForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  //reset errors
  movieMessage.textContent = '';

  // get the values
  const fullname = movieForm.fullname.value;
  const biography = movieForm.biography.value;
  const isPublic = movieForm.isPublic.value == 'true' ? true : false;

  try {
    const res = await fetch('/new-actor', {
      method: 'POST',
      body: JSON.stringify({
        fullname: fullname,
        biography: biography,
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
      movieForm.fullname.value = '';
      movieForm.biography.value = '';
    }
  } catch (err) {
    console.log(err);
    location.replace('/new-actor');
  }
});
