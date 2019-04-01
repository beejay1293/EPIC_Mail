// display feedback
const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.error !== 'string') {
    listItem += "<li class='feedback-list-item'>Please fill the required field below.</li>";
  } else if (responseData.status === 200 || responseData.status === 201) {
    listItem += `<li class='feedback-list-item'>${responseData.data[0].message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

const showSpinner = (e) => {
  if (e.target.className === 'tit' || e.target.className === 'loginbtn') {
    document.querySelector('.tit').innerHTML = 'Loading ...';
    document.querySelector('.tit').style.display = 'inline-block';
    document.querySelector('.loginbtn').disabled = true;

    document.getElementById('spinbtn').style.display = 'inline-block';
  } else if (e.target.className === 'signuptit' || e.target.className === 'registerbtn') {
    document.querySelector('.signuptit').innerHTML = 'Loading ...';
    document.querySelector('.signuptit').style.display = 'inline-block';
    document.querySelector('.registerbtn').disabled = true;

    document.getElementById('spinbtn2').style.display = 'inline-block';
  }
};

const hideSpinner = (e) => {
  if (e.target.className === 'tit' || e.target.className === 'loginbtn') {
    document.getElementById('spinbtn').style.display = 'none';
    document.querySelector('.tit').innerHTML = 'Login';
    document.querySelector('.loginbtn').disabled = false;
  } else if (e.target.className === 'signuptit' || e.target.className === 'registerbtn') {
    document.getElementById('spinbtn2').style.display = 'none';
    document.querySelector('.signuptit').innerHTML = 'Sign up';
    document.querySelector('.registerbtn').disabled = false;
  }
};

const displayFeedbackLogin = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.error !== 'string') {
    listItem += "<li class='feedback-list-item'>Please fill the required field below.</li>";
  } else if (responseData.status === 200 || responseData.status === 201) {
    listItem += "<li class='feedback-list-item'>Login Successful</li>";
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

// Create new user account
const signUp = (e) => {
  e.preventDefault();
  showSpinner(e);
  // get all user input values
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const number = document.getElementById('number').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  const feedbackContainer = document.querySelector('.feedback_container');
  const feedbackContainer2 = document.querySelector('.feedback_container2');

  feedbackContainer.innerHTML = '';

  if (password !== password2) {
    feedbackContainer2.innerHTML = 'comfirm password does not match';
    feedbackContainer2.style.color = 'red';
    feedbackContainer2.style.border = '0.7px solid #dc3545';
  } else {
    feedbackContainer2.innerHTML = '';
    feedbackContainer2.style.border = 'none';
    // sign up API-endpoint url
    const url = 'https://andela-epic-mail.herokuapp.com/api/v2/auth/signup';

    // User input data object
    const formData = {
      firstname,
      lastname,
      email,
      password,
      number,
    };

    console.log(formData);

    // Make a post request to sign up endpoint
    fetch(
      url,

      {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      },
    )
      .then(res => res.json())
      .then((body) => {
        hideSpinner(e);
        console.log(body);

        // check for success status
        if (body.status === 201) {
          // store user data in browser local storage
          const userData = JSON.stringify({
            username: body.data.lastname,
            token: body.data.token,
          });
          localStorage.setItem('user', userData);

          feedbackContainer.innerHTML = 'welcome';
          feedbackContainer.classList.remove('feedback-message-error');
          feedbackContainer.classList.add('feedback-message-success');
          window.scrollTo(0, 0);

          // redirect user to dashboard after 2 seconds
          window.location.href = 'dashboard.html';
        } else {
          feedbackContainer.innerHTML = displayFeedback(body);
          feedbackContainer.classList.add('feedback-message-error');
          window.scrollTo(0, 0);

          // cycle over each element in the error array
          // cycle over each form field next sibling
          // check and display error if any
          body.error.forEach((element) => {
            Object.keys(formData).forEach((key) => {
              if (element.key === key) {
                document.querySelector(`.${element.key}`).style.border = '0.7px solid #dc3545';
                document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = element.Rule;
              }
            });
          });
        }
      })
      .catch(err => err);
  }
};

// Get sign up button
const signupbtn = document.getElementById('signup');

// bind click event to sign up button
signupbtn.addEventListener('click', signUp);

const signIn = (e) => {
  e.preventDefault();
  showSpinner(e);

  // get form data
  const userEmail = document.getElementById('sign-in-email').value;
  const userPassword = document.getElementById('sign-in-password').value;
  const feedbackContainerLogin = document.querySelector('.feedback-message-login');

  feedbackContainerLogin.innerHTML = '';

  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/auth/login';

  const formData = {
    email: userEmail,
    password: userPassword,
  };
  console.log(formData);
  // make post request to sign in route
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then((body) => {
      console.log(body);
      hideSpinner(e);

      // check for success status
      if (body.status === 200) {
        // store user data in browser local storage

        const userData = JSON.stringify({
          username: body.data.lastname,
          token: body.data.token,
        });
        localStorage.setItem('user', userData);

        feedbackContainerLogin.innerHTML = displayFeedbackLogin(body);
        feedbackContainerLogin.classList.remove('feedback-message-error');
        feedbackContainerLogin.classList.add('feedback-message-success');
        window.scrollTo(0, 0);

        // redirect user to dashboard after 2 seconds
        window.location.href = 'dashboard.html';
      } else {
        feedbackContainerLogin.innerHTML = displayFeedback(body);
        feedbackContainerLogin.classList.add('feedback-message-error');
        window.scrollTo(0, 0);
        // cycle over each element in the error array
        // cycle over each form field next sibling
        // check and display error if any
        body.error.forEach((element) => {
          Object.keys(formData).forEach((key) => {
            if (element.key === key) {
              document.querySelector(`.${element.key}`).style.border = '0.7px solid #dc3545';
              document.querySelector(`.${element.key}`).nextElementSibling.innerHTML = element.Rule;
            }
          });
        });
      }
    })
    .catch(err => err);
};

const signInBtn = document.getElementById('sign-in-btn');

// bind click event to sign in button
signInBtn.addEventListener('click', signIn);
