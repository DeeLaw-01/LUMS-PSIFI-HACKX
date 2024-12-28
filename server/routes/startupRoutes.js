import express from 'express'
import verifyToken from '../middlewares/verifyToken.js'
import * as startupController from '../controllers/startupController.js'
import * as startupTeamController from '../controllers/startupTeamController.js'
import * as startupProductController from '../controllers/startupProductController.js'
import * as startupProjectController from '../controllers/startupProjectController.js'
import * as startupPostController from '../controllers/startupPostController.js'
import * as startupTimelineController from '../controllers/startupTimelineController.js'

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

// Product routes
router.post('/:startupId/products', verifyToken, startupProductController.addProduct)
router.put('/:startupId/products/:productId', verifyToken, startupProductController.updateProduct)
router.delete('/:startupId/products/:productId', verifyToken, startupProductController.deleteProduct)

// Project routes
router.post('/:startupId/projects', verifyToken, startupProjectController.addProject)
router.put('/:startupId/projects/:projectId', verifyToken, startupProjectController.updateProject)
router.delete('/:startupId/projects/:projectId', verifyToken, startupProjectController.deleteProject)

// Post routes
router.post('/:startupId/posts', verifyToken, startupPostController.addPost)
router.put('/:startupId/posts/:postId', verifyToken, startupPostController.updatePost)
router.delete('/:startupId/posts/:postId', verifyToken, startupPostController.deletePost)

// Timeline routes
router.get('/:startupId/timeline', verifyToken, startupTimelineController.getTimelineEvents)
router.post('/:startupId/timeline', verifyToken, startupTimelineController.addTimelineEvent)
router.put('/:startupId/timeline/:eventId', verifyToken, startupTimelineController.updateTimelineEvent)
router.delete('/:startupId/timeline/:eventId', verifyToken, startupTimelineController.deleteTimelineEvent)

export default router
