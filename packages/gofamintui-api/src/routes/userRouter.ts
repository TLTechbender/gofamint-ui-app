import { Router } from "express";
import { editUserProfile } from "../controllers/user/editProfile";
import { requireAuth } from "../middlewares/authenticate";
import { getPublicUserProfile } from "../controllers/user/getPublicUserProfile";
import { getUserProfile } from "../controllers/user/getProfile";

const router = Router();


router.get('/user/:userName', getPublicUserProfile);
router.use(requireAuth)

router.get('/user/me', getUserProfile);
router.patch('/user/me', editUserProfile);


export { router as UserRouter };