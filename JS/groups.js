const checked = [];
document.querySelector('.add-contact').addEventListener('click', (e) => {
  e.target.classList.toggle('checked');
  if (e.target.classList[0] === 'checked') {
    if (e.target.name !== undefined) {
      checked.push(e.target.name);
    }
  } else if (e.target.classList[0] !== 'checked') {
    if (e.target.name !== undefined) {
      const index = checked.indexOf(e.target.name);
      checked.splice(index, 1);
    }
  }
});

const displayFeedBack = (responseData) => {
  let listItem = '';

  if (responseData.status === 400 && typeof responseData.error === 'string') {
    listItem += `<li class='feedback-list-item'> ${responseData.error} </li>`;
  } else if (responseData.status === 500 && typeof responseData.error === 'string') {
    listItem += `<li class='feedback-list-item'> ${responseData.error}</li>`;
  }

  return listItem;
};

const addGroup = (e) => {
  e.preventDefault();
  // eslint-disable-next-line no-undef
  showOverlay();

  const groupname = document.querySelector('.groupname').value;
  const feedBackContainer = document.querySelector('.feedback-container');

  const formData = {
    groupname,
  };
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/groups';

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
      // eslint-disable-next-line no-undef
      hideOverlay();

      if (body.status === 201) {
        if (checked.length > 0) {
          const form = {
            email: checked,
          };

          const addUserUrl = `https://andela-epic-mail.herokuapp.com/api/v2/groups/${
            body.data.id
          }/users`;
          fetch(addUserUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              token: userToken,
            },
            body: JSON.stringify(form),
          })
            .then(res => res.json())
            .then((userBody) => {
              console.log(userBody);

              if (userBody.status === 201) {
                feedBackContainer.innerHTML = ` ${checked.length} new group members added`;
                feedBackContainer.classList.remove('feedback-message-error');
                feedBackContainer.classList.add('feedback-message-success');

                // reload page after 2 seconds
                setInterval(() => {
                  window.location.href = 'dashboard.html';
                }, 2000);
              }
            });
        }
        feedBackContainer.innerHTML = 'Group Created';
        feedBackContainer.classList.remove('feedback-message-error');
        feedBackContainer.classList.add('feedback-message-success');

        // reload page after 2 seconds
        setInterval(() => {
          window.location.href = 'dashboard.html';
        }, 2000);
      } else {
        feedBackContainer.innerHTML = displayFeedBack(body);
        feedBackContainer.classList.remove('feedback-message-success');
        feedBackContainer.classList.add('feedback-message-error');
      }
    })
    .catch(err => err);
};

document.querySelector('.create-group').addEventListener('click', addGroup);
