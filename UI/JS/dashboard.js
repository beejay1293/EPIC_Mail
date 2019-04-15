const messageBody = document.querySelector('.main__body');
const overlay = document.querySelector('.overlay');
const inboxButton = document.querySelector('.inbox__btn');
const draftButton = document.querySelector('.draft__btn');
const sentButton = document.querySelector('.sent__btn');
const starredButton = document.querySelector('.starred__btn');
const contactButton = document.querySelector('.contacts__btn');
const sentBody = document.querySelector('.sent__body');
const inboxBody = document.querySelector('.inbox__body');
const draftBody = document.querySelector('.draft__body');
const starredBody = document.querySelector('.starred__body');
const topNav = document.querySelector('.top__nav');
const readEmail = document.querySelector('.read__email');
const passwordResetOverlay = document.querySelector('.password__reset_overlay');
const createGroupOverlay = document.querySelector('.create__group_overlay');
const topNavInbox = document.querySelector('.top_nav_inbox__btn');
const topNavSent = document.querySelector('.top_nav_sent__btn');
const topNavDraft = document.querySelector('.top_nav_draft__btn');
const topNavStarred = document.querySelector('.top_nav_starred__btn');
const topNavContact = document.querySelector('.top_nav_contacts__btn');
const up = document.querySelector('.up');
const topNavUp = document.querySelector('.top_nav_up');
const allGroup = document.querySelector('.all__groups');
const topNavAllGroup = document.querySelector('.top_nav_all__groups');
const dropDownUser = document.querySelector('.dropdown-user');
const allContacts = document.querySelector('.all_contacts');
const bars = document.querySelector('.nav_name');

document.addEventListener('click', (e) => {
  if (e.target.className === 'add') {
    dropDownUser.style.display = 'block';
  }

  if (e.target.className === 'create__group' || e.target.className === 'top_nav_create__group') {
    createGroupOverlay.style.display = 'block';
    topNav.classList.remove('top__navs');
    messageBody.classList.remove('main__body__height');
    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');
    passwordResetOverlay.style.display = 'none';
    overlay.style.display = 'none';
    document.querySelector('.Edit_groupname_overlay').style.display = 'block';
  }

  if (e.target.className === 'clear__overlay') {
    createGroupOverlay.style.display = 'none';
    document.querySelector('.Edit_groupname_overlay').style.display = 'none';
  }

  if (e.target.className === 'top_nav_group__wrapper') {
    topNavUp.classList.toggle('down');
    topNavAllGroup.classList.toggle('show__groups');
    messageBody.classList.toggle('main__body__height2');
  }

  if (e.target.className === 'group__wrapper') {
    up.classList.toggle('down');

    allGroup.classList.toggle('show__groups');
  }
  if (e.target.className === 'reset__password') {
    passwordResetOverlay.style.display = 'block';
    overlay.style.display = 'none';
    createGroupOverlay.style.display = 'none';

    document.querySelector('.Edit_groupname_overlay').style.display = 'none';
  }

  if (e.target.className === 'clear__overlay') {
    passwordResetOverlay.style.display = 'none';
  }

  if (e.target.parentNode.className === 'draft__message') {
    overlay.style.display = 'block';
  }

  if (
    e.target.classList[0] === 'top_nav_inbox__btn'
    || e.target.classList[0] === 'top_nav_sent__btn'
    || e.target.classList[0] === 'top_nav_draft__btn'
    || e.target.classList[0] === 'top_nav_starred__btn'
    || e.target.classList[0] === 'top_nav_contacts__btn'
  ) {
    topNav.classList.toggle('top__navs');
    messageBody.classList.toggle('main__body__height');
  }

  if (e.target.className === 'fas fa-bars') {
    topNav.classList.toggle('top__navs');
    messageBody.classList.toggle('main__body__height');
    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');
  }

  if (
    e.target.className === 'compose__message_btn'
    || e.target.parentNode.className === 'plus__icon'
    || e.target.className === 'create'
  ) {
    overlay.style.display = 'block';
    topNav.classList.remove('top__navs');
    messageBody.classList.remove('main__body__height');
    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');
    passwordResetOverlay.style.display = 'none';
    createGroupOverlay.style.display = 'none';
    document.querySelector('.Edit_groupname_overlay').style.display = 'none';
  }

  if (e.target.className === 'clear__overlay') {
    overlay.style.display = 'none';
  }

  if (e.target.classList[0] === 'inbox__btn' || e.target.classList[0] === 'top_nav_inbox__btn') {
    draftButton.classList.remove('active');
    sentButton.classList.remove('active');
    starredButton.classList.remove('active');
    inboxButton.classList.add('active');
    contactButton.classList.remove('active');

    topNavSent.classList.remove('actives');
    topNavDraft.classList.remove('actives');
    topNavStarred.classList.remove('actives');
    topNavInbox.classList.add('actives');
    topNavContact.classList.remove('actives');

    inboxBody.style.display = 'block';
    draftBody.style.display = 'none';
    sentBody.style.display = 'none';
    starredBody.style.display = 'none';
    readEmail.style.display = 'none';
    allContacts.style.display = 'none';

    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');

    bars.textContent = 'inbox';
  }

  if (e.target.classList[0] === 'draft__btn' || e.target.classList[0] === 'top_nav_draft__btn') {
    inboxButton.classList.remove('active');
    sentButton.classList.remove('active');
    starredButton.classList.remove('active');
    draftButton.classList.add('active');
    contactButton.classList.remove('active');

    topNavSent.classList.remove('actives');
    topNavDraft.classList.add('actives');
    topNavStarred.classList.remove('actives');
    topNavInbox.classList.remove('actives');
    topNavContact.classList.remove('actives');

    draftBody.style.display = 'block';
    inboxBody.style.display = 'none';
    sentBody.style.display = 'none';
    starredBody.style.display = 'none';
    readEmail.style.display = 'none';
    allContacts.style.display = 'none';

    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');

    bars.textContent = 'draft';
  }

  if (e.target.classList[0] === 'sent__btn' || e.target.classList[0] === 'top_nav_sent__btn') {
    inboxButton.classList.remove('active');
    draftButton.classList.remove('active');
    starredButton.classList.remove('active');
    sentButton.classList.add('active');
    contactButton.classList.remove('active');

    topNavSent.classList.add('actives');
    topNavDraft.classList.remove('actives');
    topNavStarred.classList.remove('actives');
    topNavInbox.classList.remove('actives');
    topNavContact.classList.remove('actives');

    sentBody.style.display = 'block';
    inboxBody.style.display = 'none';
    draftBody.style.display = 'none';
    starredBody.style.display = 'none';
    readEmail.style.display = 'none';
    allContacts.style.display = 'none';

    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');

    bars.textContent = 'sent';
  }

  if (
    e.target.classList[0] === 'starred__btn'
    || e.target.classList[0] === 'top_nav_starred__btn'
  ) {
    draftButton.classList.remove('active');
    inboxButton.classList.remove('active');
    sentButton.classList.remove('active');
    starredButton.classList.add('active');
    contactButton.classList.remove('active');

    topNavSent.classList.remove('actives');
    topNavDraft.classList.remove('actives');
    topNavStarred.classList.add('actives');
    topNavInbox.classList.remove('actives');
    topNavContact.classList.remove('actives');

    starredBody.style.display = 'block';
    draftBody.style.display = 'none';
    sentBody.style.display = 'none';
    inboxBody.style.display = 'none';
    readEmail.style.display = 'none';
    allContacts.style.display = 'none';

    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');

    bars.textContent = 'starred';
  }

  // if (
  //   e.target.classList[0] === 'name'
  //   || e.target.classList[0] === 'time'
  //   || e.target.classList[0] === 'message'
  // ) {
  //   readEmail.style.display = 'block';
  //   draftBody.style.display = 'none';
  //   sentBody.style.display = 'none';
  //   inboxBody.style.display = 'none';
  //   starredBody.style.display = 'none';
  // }

  if (
    e.target.classList[0] === 'top_nav_contacts__btn'
    || e.target.classList[0] === 'contacts__btn'
  ) {
    allContacts.style.display = 'block';
    draftBody.style.display = 'none';
    sentBody.style.display = 'none';
    inboxBody.style.display = 'none';
    starredBody.style.display = 'none';
    readEmail.style.display = 'none';

    draftButton.classList.remove('active');
    inboxButton.classList.remove('active');
    sentButton.classList.remove('active');
    starredButton.classList.remove('active');
    contactButton.classList.add('active');

    topNavSent.classList.remove('actives');
    topNavDraft.classList.remove('actives');
    topNavStarred.classList.remove('actives');
    topNavInbox.classList.remove('actives');
    topNavContact.classList.add('actives');

    topNavUp.classList.remove('down');
    topNavAllGroup.classList.remove('show__groups');
    messageBody.classList.remove('main__body__height2');

    bars.textContent = 'contacts';
  }
});

const grpcheck = document.querySelector('.checkbox__grp');
grpcheck.addEventListener('change', () => {
  if (grpcheck.checked) {
    document.getElementById('group__list').style.display = 'block';
    document.querySelector('.messageTo').style.display = 'none';
  } else {
    document.getElementById('group__list').style.display = 'none';
    document.querySelector('.messageTo').style.display = 'block';
  }
});

window.onload = () => {
  inboxButton.classList.add('active');
  topNavInbox.classList.add('actives');
};
