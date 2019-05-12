// display feedback
const displayFeedback = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.errors === 'object') {
    listItem
      += "<li class='feedback-list-item'>Please fill the required field below to send message.</li>";
  } else if (responseData.status === 201 && typeof responseData.data.msg === 'object') {
    listItem += "<li class='feedback-list-item'>message sent successfully</li>";
  } else if (responseData.status === 201 && typeof responseData.data.rows[0] === 'object') {
    listItem += "<li class='feedback-list-item'>message saved</li>";
  } else if (responseData.status === 201 && typeof responseData.data === 'object') {
    listItem += "<li class='feedback-list-item'>message sent to group</li>";
  } else {
    listItem += `<li class='feedback-list-item'>${responseData.errors}</li>`;
  }

  return listItem;
};

// show overlay
const showOverlay = () => {
  document.querySelector('.spinner_overlay').style.display = 'block';
};

// hide overlay
const hideOverlay = () => {
  document.querySelector('.spinner_overlay').style.display = 'none';
};

// get inbox
const getAllInbox = () => {
  showOverlay();
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages';
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
      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox += '<li class="empty"> <h1>No message in inbox </h1> </li>';
        } else {
          body.data.forEach((message) => {
            if (message.status === 'sent') {
              const str = ` <p class="inline inlineUnread">${
                message.subject
              }</p> -<p class="ms msUnread">${message.message}</p>`;
              let msg;
              if (str.length > 80) {
                const substring = str.substring(0, 80);
                msg = `${substring}...`;
              } else {
                msg = str;
              }
              const formatedDate = moment(message.createdon).format('Do MMMM');
              inbox += `<li  class="inbox__message ${
                message.id
              } msg msgUnread"><input type="checkbox" class="checkbox"> <h1 class="name nameUnread">${
                message.sender
              }</h1> <h1 class="message"> ${msg}</h1> <h1 class="time timeUnread">${formatedDate}</h1><div class="delete__icon"> <i class="fas fa-trash-alt"></i></div></li>
                      `;
            } else {
              const str = ` <p class="inline">${message.subject}</p> -<p class="ms">${
                message.message
              }</p>`;
              let msg;
              if (str.length > 80) {
                const substring = str.substring(0, 80);
                msg = `${substring}...`;
              } else {
                msg = str;
              }
              const formatedDate = moment(message.createdon).format('Do MMMM');
              inbox += `<li  class="inbox__message ${
                message.id
              } msg"><input type="checkbox" class="checkbox"> <h1 class="name">${
                message.sender
              }</h1> <h1 class="message"> ${msg}</h1> <h1 class="time">${formatedDate}</h1><div class="delete__icon"> <i class="fas fa-trash-alt"></i></div></li>
                    `;
            }
          });
        }

        const messageBody = document.querySelector('.inbox__body');
        messageBody.innerHTML = inbox;
      }
    })
    .catch(err => err);
};

const getAllDraftMessages = () => {
  showOverlay();

  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages/draft';

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
      hideOverlay();
      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox
            += '<li class="empty"> <h1>No sent messages click <a class="create">here</a> to send a message</h1> </li>';
        } else {
          body.data.forEach((message) => {
            const str = ` <p class="inline">${message.subject}</p> -<p class="ms">${
              message.message
            }</p>`;

            let msg;
            if (str.length > 80) {
              const substring = str.substring(0, 80);
              msg = `${substring}...`;
            } else {
              msg = str.substring(0, 80);
            }
            const formatedDate = moment(message.createdon).format('Do MMMM');
            inbox += `<li  class="inbox__message ${
              message.id
            } msg"><input type="checkbox" class="checkbox"> <h1 class="name">To: ${
              message.receiver
            }</h1> <h1 class="message"> ${msg}</h1> <h1 class="time">${formatedDate}</h1><div class="delete__icon"> <i class="fas fa-trash-alt"></i></div></li>
                    `;
          });
        }

        const messageBody = document.querySelector('.draft__body');
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
      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox
            += '<li class="empty"> <h1>No sent messages click <a class="create">here</a> to send a message</h1> </li>';
        } else {
          body.data.forEach((message) => {
            const str = ` <p class="inline">${message.subject}</p> -<p class="ms">${
              message.message
            }</p>`;

            let msg;
            if (str.length > 80) {
              const substring = str.substring(0, 80);
              msg = `${substring}...`;
            } else {
              msg = str.substring(0, 80);
            }
            const formatedDate = moment(message.createdon).format('Do MMMM');
            inbox += `<li  class="inbox__message ${
              message.id
            } msg"><input type="checkbox" class="checkbox"> <h1 class="name">To: ${
              message.receiver
            }</h1> <h1 class="message"> ${msg}</h1> <h1 class="time">${formatedDate}</h1><div class="delete__icon"> <i class="fas fa-trash-alt"></i></div></li>
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

// get all unread messages
const getAllUnreadMessages = () => {
  showOverlay();
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages/unread';

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
      if (body.status === 200) {
        let inbox = '';
        if (body.data.length === 0) {
          inbox += '<li class="empty"> <h1>No unread messages</h1> </li>';
        } else {
          body.data.forEach((message) => {
            const str = ` <p class="inline inlineUnread">${
              message.subject
            }</p> -<p class="ms msUnread">${message.message}</p>`;
            let msg;
            if (str.length > 80) {
              const substring = str.substring(0, 80);
              msg = `${substring}...`;
            } else {
              msg = str.substring(0, 80);
            }
            const formatedDate = moment(message.createdon).format('Do MMMM');
            inbox += `<li  class="inbox__message ${
              message.id
            }msg msgUnread"><input type="checkbox" class="checkbox"> <h1 class="name nameUnread">${
              message.sender
            }</h1> <h1 class="message"> ${msg}</h1> <h1 class="time timeUnread">${formatedDate}</h1><div class="delete__icon"> <i class="fas fa-trash-alt"></i></div></li>
                    `;
          });
        }

        const messageBody = document.querySelector('.starred__body');
        messageBody.innerHTML = inbox;
      } else {
        console.log(body);
      }
    })
    .catch(err => err);
};

// send or save messages as draft
const postMessages = (e) => {
  e.preventDefault();
  showOverlay();

  // get form data
  const reciever = document.querySelector('.messageTo').value;
  const subject = document.querySelector('.messageSubject').value;
  const messageContent = document.querySelector('.messageContent').value;
  const feedbackContainer = document.querySelector('.feedback_container');

  let status;
  if (e.target.classList[0] === 'draft_message__btn') {
    status = 'draft';
  }

  let formData;
  let url;

  const grpcheck = document.querySelector('.checkbox__grp');
  const grpId = document.getElementById('group__list').value;

  if (grpcheck.checked) {
    formData = {
      subject,
      message: messageContent,
    };
    url = `https://andela-epic-mail.herokuapp.com/api/v2/groups/${grpId}/messages`;
  } else {
    formData = {
      reciever,
      subject,
      message: messageContent,
      status,
    };
    url = 'https://andela-epic-mail.herokuapp.com/api/v2/messages';
  }

  let userToken;

  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const { token } = userData;
    userToken = token;
  }

  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      token: userToken,
    },
    body: JSON.stringify(formData),
  })
    .then(res => res.json())
    .then((body) => {
      hideOverlay();

      if (body.status === 201) {
        const overlay = document.querySelector('.overlay');

        overlay.style.display = 'none';

        // reload page
        getAllInbox();
        getAllSent();
        getAllUnreadMessages();
        getAllDraftMessages();

        if (grpcheck.checked) {
          document.querySelector('.feed').innerHTML = 'Message sent to group successfully';
        } else {
          document.querySelector('.feed').innerHTML = displayFeedback(body);
        }

        const feedbackOverlay = document.querySelector('.feedbackOverlay');
        feedbackOverlay.style.display = 'block';

        setInterval(() => {
          feedbackOverlay.style.display = 'none';
        }, 2000);

        feedbackContainer.innerHTML = '';
        document.querySelector('.messageTo').value = '';
        document.querySelector('.messageSubject').value = '';
        document.querySelector('.messageContent').value = '';
        grpcheck.checked = 'false';
      } else {
        feedbackContainer.innerHTML = displayFeedback(body);
        feedbackContainer.classList.remove('feedback-message-success');
        feedbackContainer.classList.add('feedback-message-error');
      }
    })
    .catch(err => err);
};

// get specific message
const getSpecificMessage = (e) => {
  let messageId;
  const readMessage = document.querySelector('.read__email');
  let messageContent;

  if (
    e.target.classList[0] === 'message'
    || e.target.classList[0] === 'name'
    || e.target.classList[0] === 'time'
    || e.target.classList[0] === 'inline'
    || e.target.classList[0] === 'ms'
  ) {
    showOverlay();

    if (e.target.classList[0] === 'inline' || e.target.classList[0] === 'ms') {
      // eslint-disable-next-line prefer-destructuring
      messageId = e.target.parentNode.parentNode.classList[1];
    } else {
      // eslint-disable-next-line prefer-destructuring
      messageId = e.target.parentNode.classList[1];
    }

    let userToken;

    if (localStorage.getItem('user')) {
      const userData = JSON.parse(localStorage.getItem('user'));
      const { token } = userData;
      userToken = token;
    }

    const url = `https://andela-epic-mail.herokuapp.com/api/v2/messages/${messageId}`;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        token: userToken,
      },
    })
      .then(res => res.json())
      .then((body) => {
        console.log(body);

        if (body.status === 200) {
          hideOverlay();

          const formatedDated = moment(body.data.createdon).format('Do MMMM');

          messageContent = `<div class="subject__wrapper"><h1 class="subject">${
            body.data.subject
          }</h1> <p class="time__created">${formatedDated} </p></div>

            
          <div class="users">

            <h1 class="from">${body.sender.firstname} ${
  body.sender.lastname
}     </h1><p class="epic">     < ${body.data.sender} ></p>
            <p class="to">to: ${body.data.receiver}</p>
          </div>
                
          <div class="message__body">
           <p> ${body.data.message}
            </p> 
            
          </div>
          <hr class="line"/>`;
          readMessage.innerHTML = messageContent;
          getAllInbox();
          getAllSent();
          getAllUnreadMessages();

          // eslint-disable-next-line no-undef
          readEmail.style.display = 'block';
          // eslint-disable-next-line no-undef
          draftBody.style.display = 'none';
          // eslint-disable-next-line no-undef
          sentBody.style.display = 'none';
          // eslint-disable-next-line no-undef
          inboxBody.style.display = 'none';
          // eslint-disable-next-line no-undef
          starredBody.style.display = 'none';
        }
      });
  }
};

// delete specific message
const deleteMessage = (e) => {
  let messageId;

  if (
    e.target.parentNode.classList[0] === 'delete__icon'
    || e.target.classList[0] === 'delete__icon'
  ) {
    showOverlay();

    if (e.target.classList[0] === 'delete__icon') {
      // eslint-disable-next-line prefer-destructuring
      messageId = e.target.parentNode.classList[1];
    } else {
      // eslint-disable-next-line prefer-destructuring
      messageId = e.target.parentNode.parentNode.classList[1];
    }

    let userToken;

    if (localStorage.getItem('user')) {
      const userData = JSON.parse(localStorage.getItem('user'));
      const { token } = userData;
      userToken = token;
    }

    const url = `https://andela-epic-mail.herokuapp.com/api/v2/messages/${messageId}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'authorization/json',
        token: userToken,
      },
    })
      .then(res => res.json())
      .then((body) => {
        hideOverlay();
        if (body.status === 200) {
          getAllSent();
          getAllInbox();
          getAllUnreadMessages();
        }
      });
  }
};

document.addEventListener('click', getSpecificMessage);
document.addEventListener('click', deleteMessage);
document.getElementById('reload').addEventListener('click', () => {
  getAllSent();
  getAllInbox();
  getAllUnreadMessages();
});

document.querySelector('.send_message__btn').addEventListener('click', postMessages);
document.querySelector('.draft_message__btn').addEventListener('click', postMessages);
getAllUnreadMessages();
getAllInbox();
getAllSent();
getAllDraftMessages();
