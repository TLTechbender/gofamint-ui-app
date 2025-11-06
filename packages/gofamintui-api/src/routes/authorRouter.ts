

import { Router } from "express";
import { requireAuth } from "../middlewares/authenticate";
import { applyForAuthor } from "../controllers/author/applyForAuthor";
import { uploadImage } from "../middlewares/upload";
import { editAuthorProfile } from "../controllers/author/editAuthorProfile";
import { getAuthorAnalytics } from "../controllers/author/getAuthorAnalytics";
import { getAuthorRecentPosts } from "../controllers/author/getAuthorRecentPosts";


const router = Router();


router.use(requireAuth);


router.post('/author/apply',uploadImage.single ,applyForAuthor);

router.patch('/author/profile',uploadImage.single ,editAuthorProfile);


router.get('/author/analytics', getAuthorAnalytics);
router.get('/author/posts/recent', getAuthorRecentPosts);

export { router as authorRouter };