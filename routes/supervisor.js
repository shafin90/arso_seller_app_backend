const express = require('express');
const supervisorController = require('../controllers/supervisor');

const router = express.Router();

// Example routes for supervisor controllers
router.post('/', supervisorController.createSupervisor);
router.post('/login', supervisorController.login);
router.get("/email:email", supervisorController.getSupervisorByEmail)
router.put("/:email", supervisorController.updateSupervisorByEmail)
router.get('/district', supervisorController.getDistricts);


module.exports = router;