import express from 'express';
import GroupController from '../../controllers/groupController';
import isAuth from '../../middleswares/is-Auth';

const { verifyTokendb } = isAuth;

const {
  createGroup,
  GetAllGroups,
  EditSpecificGroupName,
  DeleteSpecificGroup,
  AddUserToGroup,
} = GroupController;

const router = express.Router();

// post a group route
router.post('/groups', verifyTokendb, createGroup);

// get all group route
router.get('/groups', verifyTokendb, GetAllGroups);

// edit a specific group name
router.patch('/groups/:groupId/name', verifyTokendb, EditSpecificGroupName);

// delete a specific group
router.delete('/groups/:groupId', verifyTokendb, DeleteSpecificGroup);

// Add a user to a specific group
router.post('/groups/:groupId/users', verifyTokendb, AddUserToGroup);

// expose router
export default router;
