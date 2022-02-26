const formLogin = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-res');

if (formLogin) {
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    console.log('123');
    //reset errors
    loginMessage.textContent = '';

    // get the values
    const username = formLogin.username.value;
    const password = formLogin.password.value;

    try {
      const res = await fetch('/login', {
        method: 'POST',
        body: JSON.stringify({
          username,
          password,
        }),
        // body data type must match "Content-Type" header
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const loginData = await res.json();

      console.log(loginData);
      if (loginData.errors) {
        loginMessage.textContent = loginData.errors;
      }
      if (loginData.user) {
        // The Location.assign method causes the window to load and display the document at the URL specified. After the navigation occurs, the user can navigate back to the page that called Location.assign by pressing the "back" button.
        location.replace('/');
        // redirect to Programmers Page
      }
    } catch (err) {
      console.log(err);
      location.replace('/');
    }
  });
}
