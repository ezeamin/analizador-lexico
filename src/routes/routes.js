import express from 'express';

import {
  getTable,
  postAnalyze,
} from '../controllers/controllers.js';

import validateBody from '../middlewares/validateBody.js';

const router = express.Router();

// POST ---------------------------
router.post('/analyze', validateBody, postAnalyze);

router.get('/table', getTable);

export default router;
