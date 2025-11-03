import express from 'express';
import AuthRoute from "./auth.route";

const router = express.Router();

router.use('/auth', AuthRoute);

export default router;
