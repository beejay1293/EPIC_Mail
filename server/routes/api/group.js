import express from 'express';
import GroupController from '../../controllers/groupController';
import isAuth from '../../middleswares/is-Auth';

const { verifyTokendb } = isAuth;

const { createGroup, GetAllGroups, EditSpecificGroupName } = GroupController;

const router = express.Router();

// post a group route
router.post('/groups', verifyTokendb, createGroup);

// get all group route
router.get('/groups', verifyTokendb, GetAllGroups);

router.patch('/groups/:groupId/name', verifyTokendb, EditSpecificGroupName);

// expose router
export default router;
