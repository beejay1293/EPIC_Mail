# EPIC_Mail

EPIC Mail is an Application that helps people exchange messages/information over the internet.

[![Build Status](https://travis-ci.org/beejay1293/EPIC_Mail.svg?branch=develop)](https://travis-ci.org/beejay1293/EPIC_Mail)
[![Coverage Status](https://coveralls.io/repos/github/beejay1293/EPIC_Mail/badge.svg?branch=develop)](https://coveralls.io/github/beejay1293/EPIC_Mail?branch=develop)
[![Maintainability](https://api.codeclimate.com/v1/badges/aab9e6675e79967beef4/maintainability)](https://codeclimate.com/github/beejay1293/EPIC_Mail/maintainability)

## Required Features

- User can sign up
- User can sign in
- Users can **get create or send an email**
- Users can **fetch all received emails**
- Users can **fetch all unread received emails**
- Users can **fetch all sent emails**
- Users can **fetch a specific email record**
- Users can **delete a specific email record**
- Users can **Create a new group**
- Users can **get all groups records**
- Admin/Moderator can **edit the name of a specific group**
- Admin can **delete a specific group record**
- Admin/Moderator can **add a new user to a group**
- Admin/Moderator can **delete a user from a group**
- Users can **send an email to a group**

## Optional Features

- Deliver messages via SMS

## Technologies

- Node JS
- Express
- Mocha & Chai
- ESLint
- Babel
- Travis CI
- Code Climate & Coveralls

## Requirements and Installation

To install and run this project you would need to have listed stack installed:

- Node Js
- Git

To run:

```sh
git clone <https://github.com/beejay1293/EPIC_Mail.git>
cd EPIC_Mail
npm install
npm start
```

## Testing

```sh
npm test
```

## API-ENDPOINTS

- V1

`- POST /api/v1/auth/signup Create a new user record.`

`- POST /api/v1/auth/login login a user.`

`- POST /api/v1/messages Create or send an email.`

`- GET /api/v1/messages Get all received emails.`

`- GET /api/v1/messages/unread get all unread received emails.`

`- GET /api/v1/sent get all sent emails.`

`- GET /api/v1/messages/<:message-id> Get a specific email record.`

`- DELETE /api/v1/messages/<:message-id> Delete a specific email record.`

- v2

`- POST /api/v2/auth/signup Create a new user record.`

`- POST /api/v2/auth/login login a user.`

`- POST /api/v2/messages Create or send an email.`

`- GET /api/v2/messages Get all received emails.`

`- GET /api/v2/messages/unread get all unread received emails.`

`- GET /api/v2/sent get all sent emails.`

`- GET /api/v2/messages/<:message-id> Get a specific email record.`

`- DELETE /api/v2/messages/<:message-id> Delete a specific email record.`

`- POST /api/v2/groups Create a new group record.`

`- GET /api/v2/groups Get all group records.`

`- PATCH /api/v2/groups/<:groupId>/name Edit the name of a specific group record.`

`- DELETE /api/v2/groups/<:groupId> Delete a specific group record.`

`- POST /api/v2/groups/<:groupId>/users Add a new user to a group.`

`- DELETE /api/v2/groups/<:groupId>/users/<:userId> Delete a specific user from a group.`

`- POST /api/v2/groups/<:groupId>/messages send an email to a group.`

## Pivotal Tracker stories

[https://www.pivotaltracker.com/n/projects/2314351](https://www.pivotaltracker.com/n/projects/2314351)

## Template UI

You can see a hosted version of the template at [https://beejay1293.github.io/EPIC_Mail/](https://beejay1293.github.io/EPIC_Mail/)

## API

The API is currently in version 1 (v1) and in version 2 (v2) and is hosted at

[https://andela-epic-mail.herokuapp.com/](https://andela-epic-mail.herokuapp.com/)

## API Documentation

[https://andela-epic-mail.herokuapp.com/api-docs/](https://andela-epic-mail.herokuapp.com/api-docs/)

## Author

Matti Mobolaji Usman
