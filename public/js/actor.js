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
  const actorId = movieForm.actorId.value;

  try {
    const res = await fetch(`/actor/edit/${actorId}`, {
      method: 'PUT',
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
      movieForm.name.value = '';
      movieForm.overview.value = '';
    }
  } catch (err) {
    console.log(err);
    location.replace(`/actor/edit/${actorId}`);
  }
});
