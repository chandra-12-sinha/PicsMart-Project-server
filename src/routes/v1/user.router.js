const { followOrUnfollowController, deleteMyProfileController, getMyInfoController, updateUserProfile, getUserProfile } = require('../../contollers/user.Controller');
const requireUser = require('../../middlewere/requireUser');

const router = require('express').Router();


router.post('/follow', requireUser, followOrUnfollowController);
router.delete('/profile', requireUser, deleteMyProfileController);
router.get('/getMyInfo', requireUser, getMyInfoController);
router.put('/', requireUser, updateUserProfile);
router.post('/getUserProfile', requireUser, getUserProfile)

module.exports = router;
