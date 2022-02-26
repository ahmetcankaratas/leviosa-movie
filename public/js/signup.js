const form = document.querySelector('#signup-form');
const message = document.querySelector('#signup-res');

if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    //reset errors
    message.textContent = '';

    // get the values
    const userName = form.username.value;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const res = await fetch('/register', {
        method: 'POST',
        body: JSON.stringify({
          username: userName,
          email: email,
          password: password,
        }),
        // body data type must match "Content-Type" header
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await res.json();
      console.log(data.errors);
      if (data.errors) {
        message.textContent = data.errors;
      }
      if (data.message) {
        message.textContent = data.message;
        //reset forms
        form.username.value = '';
        form.email.value = '';
        form.password.value = '';
      }
      if (data.user) {
        // The Location.assign method causes the window to load and display the document at the URL specified. After the navigation occurs, the user can navigate back to the page that called Location.assign by pressing the "back" button.
        location.assign('/');
      }
    } catch (err) {
      console.log(err);
      location.replace('/');
    }
  });
}
