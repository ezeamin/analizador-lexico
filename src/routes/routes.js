import express from 'express';

import {
  getTable,
  postAnalyze,
  postSyntaxAnalyze,
} from '../controllers/controllers.js';

import validateBody from '../middlewares/validateBody.js';

const router = express.Router();

// POST ---------------------------
router.post('/analyze', validateBody, postAnalyze);
router.post('/syntax-analyze', validateBody, postSyntaxAnalyze);

router.get('/table', getTable);

export default router;
