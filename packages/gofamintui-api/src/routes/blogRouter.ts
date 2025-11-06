import { Router } from "express";
import { requireAuth } from "../middlewares/authenticate";

import { getBlogs } from "../controllers/blog/getBlogs";
import { getBlogStats } from "../controllers/blog/getBlogStats";

import { handleLikeInteraction } from "../controllers/blog/handleLikeInteraction";
import { addComment } from "../controllers/blog/addComment";
import { deleteComment } from "../controllers/blog/deleteComment";
import { getBlogComments } from "../controllers/blog/getBlogComments";
import { handleCommentLike } from "../controllers/blog/handleCommentLike";
import { updateGenericViewCount } from "../controllers/blog/updateGenericViews";
import { updateVerifiedViewCount } from "../controllers/blog/updateVerifiedViews";

const router = Router();


router.get('/blogs', getBlogs);
router.get('/blogs/:blogId/stats', getBlogStats);
router.get('/blogs/:blogId/comments', getBlogComments);


router.post('/blogs/:blogId/views/track', updateGenericViewCount);


router.use(requireAuth); 
//todo: I ain't create the controller for creating new blog


router.post('/blogs/:blogId/views/verified', updateVerifiedViewCount);


router.post('/blogs/:blogId/like', handleLikeInteraction);

router.post('/blogs/:blogId/comments', addComment);
router.delete('/blogs/:blogId/comments/:commentId', deleteComment);


router.post('/blogs/:blogId/comments/:commentId/like', handleCommentLike);

export { router as blogRouter };