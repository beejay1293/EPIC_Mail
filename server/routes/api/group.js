import express from 'express';
import GroupController from '../../controllers/groupController';
import isAuth from '../../middleswares/is-Auth';

const { verifyTokendb } = isAuth;

const { createGroup, GetAllGroups } = GroupController;

const router = express.Router();

// post a group route
router.post('/groups', verifyTokendb, createGroup);

// get all group route
router.get('/groups', verifyTokendb, GetAllGroups);

// expose router
export default router;
