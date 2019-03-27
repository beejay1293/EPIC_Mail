const showOverlay = () => {
  document.querySelector('.spinner_overlay').style.display = 'block';
};

const hideOverlay = () => {
  document.querySelector('.spinner_overlay').style.display = 'none';
};

const getAllInbox = () => {
  showOverlay();
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages';
  console.log(localStorage.getItem('token'));
  // get user object from
  let userToken = '';
  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const { token, username } = userData;
    document.querySelector('.user').innerHTML = username;

    userToken = token;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();
      console.log(body);

      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox
            += '<li class="inbox__message"> <input type="checkbox" class="checkbox"> <h1 class="name"> Welcome<h1 class="message"> Welcome to EPIC Mail</h1> <h1 class="time"> 1st march</h1></li>';
        } else {
          body.data.forEach((message) => {
            const formatedDate = moment(message.createdon).format('Do MMMM');
            inbox += `<li class="inbox__message"> <input type="checkbox" class="checkbox"> <h1 class="name"> ${
              message.subject
            } <h1 class="message"> ${
              message.message
            }</h1> <h1 class="time">${formatedDate}</h1></li>
                `;
          });
        }

        const messageBody = document.querySelector('.inbox__body');
        messageBody.innerHTML = inbox;
      } else {
        console.log(body);
      }
    })
    .catch(err => err);
};

const getAllSent = () => {
  showOverlay();
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages/sent';

  let userToken;
  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const { token } = userData;
    userToken = token;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();
      console.log(body);

      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox
            += '<li class="inbox__message"><input type="checkbox" class="checkbox"><h1 class="name"> Welcome<h1 class="message"> Send a message with EPIC Mail</h1> <h1 class="time"> 1st march</h1></li>';
        } else {
          body.data.forEach((message) => {
            const formatedDate = moment(message.createdon).format('Do MMMM');
            inbox += `<li class="inbox__message"><input type="checkbox" class="checkbox"> <h1 class="name"> ${
              message.subject
            } <h1 class="message"> ${
              message.message
            }</h1> <h1 class="time">${formatedDate}</h1></li>
                    `;
          });
        }

        const messageBody = document.querySelector('.sent__body');
        messageBody.innerHTML = inbox;
      } else {
        console.log(body);
      }
    })
    .catch(err => err);
};

getAllInbox();
getAllSent();
