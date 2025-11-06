import { Router } from "express";

import { acceptAdminInvite } from "../controllers/admin/acceptAdminInvite";
import { approveAuthor } from "../controllers/admin/approveAuthor";
import { approveBlog } from "../controllers/admin/approveBlog";
import { getAdminInvites } from "../controllers/admin/getAdminInvites";
import { getAuthor } from "../controllers/admin/getAuthor";
import { getAuthors } from "../controllers/admin/getAuthors";
import { getDashboardStats } from "../controllers/admin/getDashboardStats";
import { getPendingBlogs } from "../controllers/admin/getPendingBlogs";
import { getUser } from "../controllers/admin/getUser";
import { getUsers } from "../controllers/admin/getUsers";
import { inviteAdmin } from "../controllers/admin/inviteAdmin";
import { rejectAuthor } from "../controllers/admin/rejectAuthor";
import { removeAdmin } from "../controllers/admin/removeAdmin";
import { resendAdminInvite } from "../controllers/admin/resendAdminInvite";
import { suspendAuthor } from "../controllers/admin/suspendAuthor";
import { unapproveBlog } from "../controllers/admin/unapproveBlog";
import { unsuspendAuthor } from "../controllers/admin/unSuspendAuthor";


const router = Router();

router.get("/invites", getAdminInvites);
router.post("/invites", inviteAdmin);
router.post("/invites/accept", acceptAdminInvite);
router.post("/invites/resend", resendAdminInvite);
router.delete("/admins/:id", removeAdmin);


router.get("/authors", getAuthors);
router.get("/authors/:id", getAuthor);
router.post("/authors/:id/approve", approveAuthor);
router.post("/authors/:id/reject", rejectAuthor);
router.post("/authors/:id/suspend", suspendAuthor);
router.post("/authors/:id/unsuspend", unsuspendAuthor);


router.get("/blogs/pending", getPendingBlogs);
router.post("/blogs/:id/approve", approveBlog);
router.post("/blogs/:id/unapprove", unapproveBlog);

router.get("/users", getUsers);
router.get("/users/:id", getUser);

router.get("/stats/dashboard", getDashboardStats);


export {router as adminRouter}
