import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import * as startupController from '../controllers/startupController.js'
import * as startupTeamController from '../controllers/startupTeamController.js'

const router = express.Router()

// Startup CRUD routes
router.post('/', verifyToken, startupController.createStartup)
router.get('/:id', verifyToken, startupController.getStartup)
router.put('/:id', verifyToken, startupController.updateStartup)
router.delete('/:id', verifyToken, startupController.deleteStartup)
router.get('/user/startups', verifyToken, startupController.getUserStartups)

// Team management routes
router.post('/join/request', verifyToken, startupTeamController.requestToJoin)
router.post(
  '/join/handle',
  verifyToken,
  startupTeamController.handleJoinRequest
)
router.post(
  '/invite/create',
  verifyToken,
  startupTeamController.createInviteLink
)
router.post(
  '/join/invite',
  verifyToken,
  startupTeamController.joinViaInviteLink
)
router.put('/member/role', verifyToken, startupTeamController.updateMemberRole)
router.put(
  '/member/position',
  verifyToken,
  startupTeamController.updateMemberPosition
)
router.delete('/member', verifyToken, startupTeamController.removeMember)
router.get('/:id/team', verifyToken, startupTeamController.getTeamMembers)
router.get('/:id/requests', verifyToken, startupTeamController.getJoinRequests)

export default router
