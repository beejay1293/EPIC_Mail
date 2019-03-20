// display feedback
const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.error !== 'string') {
    listItem += "<li class='feedback-list-item'>First Name is required.</li>";
    listItem += "<li class='feedback-list-item'>Last Name is required</li>";
    listItem += "<li class='feedback-list-item'>Phone Number field is required.</li>";
    listItem += "<li class='feedback-list-item'>Email field is required.</li>";
    listItem
      += "<li class='feedback-list-item'>Password field is required and must be at least 6 characters</li>";
  } else if (responseData.status === 200 || responseData.status === 201) {
    listItem += `<li class='feedback-list-item'>${responseData.data[0].message}</li>`;
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.error}</li>`;
  }

  return listItem;
};

// Create new user account
const signUp = (e) => {
  e.preventDefault();
  // get all user input values
  const firstname = document.getElementById('firstname').value;
  const lastname = document.getElementById('lastname').value;
  const email = document.getElementById('email').value;
  const number = document.getElementById('number').value;
  const password = document.getElementById('password').value;
  const password2 = document.getElementById('password2').value;
  const feedbackContainer = document.querySelector('.feedback_container');
  const feedbackContainer2 = document.querySelector('.feedback_container2');

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
