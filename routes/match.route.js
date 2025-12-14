// routes/match.route.js
const express = require('express');
const router = express.Router();
const matchCtrl = require('../controllers/match.controller');

/**
 * GET /match/:requestId
 * Example: GET /match/60f7bd... (returns JSON)
 */
router.get('/:requestId', matchCtrl.matchDonorsByDistance);

module.exports = router;
