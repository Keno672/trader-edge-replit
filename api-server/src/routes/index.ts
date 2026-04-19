import { Router, type IRouter } from "express";
import healthRouter from "./health";
import signalsRouter from "./signals";
import watchlistRouter from "./watchlist";
import marketRouter from "./market";
import sessionsRouter from "./sessions";
import newsRouter from "./news";

const router: IRouter = Router();

router.use(healthRouter);
router.use(signalsRouter);
router.use(watchlistRouter);
router.use(marketRouter);
router.use(sessionsRouter);
router.use(newsRouter);

export default router;
