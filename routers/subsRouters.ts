import express, { Request, Response } from "express";
import * as database from "../controller/postController";
const router = express.Router();

// List all subgroups
router.get("/list", async (req: Request, res: Response) => {
  const subs = await database.getSubs();
  if (subs) subs.sort();
  res.render("subs", { subs });
});


router.get("/show/:subname", async (req: Request, res: Response) => {
  const subName = req.params.subname;
  const orderBy = req.query.orderby === 'votes' ? 'votes' : 'date';
  
  const posts = await database.getPosts(20, subName, orderBy);
  const user = req.user;
  res.render("sub", { subName, posts, user, orderBy });
});

export default router;