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

const getAllGroups = () => {
  const url = 'https://andela-epic-mail.herokuapp.com/api/v2/groups';

  let userToken;

  if (localStorage.getItem('user')) {
    const userData = JSON.parse(localStorage.getItem('user'));
    const { token } = userData;
    userToken = token;
  }

  fetch(url, {
    method: 'GET',
    headers: {
      'Content-Type': 'json/authorization',
      token: userToken,
    },
  })
    .then(res => res.json())
    .then((body) => {
      if (body.status === 'success') {
        let groups = '';
        body.data.forEach((group) => {
          console.log(group);

          if (group.role === 'admin') {
            groups += `<li class="add_user ${group.id}"> </i> ${
              group.name
            }  <div class="grp"><i class="far fa-edit edit-group"></i> <i class="fas fa-trash-alt delete-group"></i><i class="fas fa-plus message-group"></i></li></div> <ul class="group__contacts">
            <li>Mobolaji <i class="fas fa-user-minus"></i></li>
            <li>Ayo <i class="fas fa-user-minus"></i></li>
          </ul>`;
          } else if (group.moderator === 'moderator') {
            groups += `<li class="add_user"> </i> ${
              group.name
            } <i class="far fa-edit"></i> <i class="fas fa-plus"></i></li> <ul class="group__contacts">
            <li>Mobolaji <i class="fas fa-user-minus"></i></li>
            <li>Ayo <i class="fas fa-user-minus"></i></li>
          </ul>`;
          } else {
            groups += `<li class="add_user"> </i> ${
              group.name
            } <i class="fas fa-plus"></i></li> <ul class="group__contacts">
            <li>Mobolaji <i class="fas fa-user-minus"></i></li>
            <li>Ayo <i class="fas fa-user-minus"></i></li>
          </ul>`;
          }
        });

        document.querySelector('.all__groups').innerHTML = groups;
      }
    });
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

                getAllGroups();

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

        getAllGroups();

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

const deleteGroup = (e) => {
  if (e.target.classList[2] === 'delete-group') {
    const messageId = e.target.parentNode.parentNode.classList[1];
    let userToken;

    if (localStorage.getItem('user')) {
      const userData = JSON.parse(localStorage.getItem('user'));
      const { token } = userData;
      userToken = token;
    }

    const url = `https://andela-epic-mail.herokuapp.com/api/v2/groups/${messageId}`;

    fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'json/authorization',
        token: userToken,
      },
    })
      .then(res => res.json())
      .then((body) => {
        if (body.status === 200) {
          getAllGroups();
        }
      });
  }
};

document.addEventListener('click', deleteGroup);

document.querySelector('.create-group').addEventListener('click', addGroup);
getAllGroups();
