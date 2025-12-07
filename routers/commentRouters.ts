import express, { Request, Response } from "express";
import * as database from "../controller/postController";
import { ensureAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

// Todo GET -- completed
router.get("/edit/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);
  const comment = await database.getComment(commentId);
  const user = req.user as any;

  if (!comment) return res.status(404).send("Comment not found");
  if (comment.creator.id !== user.id) return res.status(403).send("Unauthorized");

  res.render("editComment", { comment });
});

// Todo POST -- completed
router.post("/edit/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);
  const comment = await database.getComment(commentId);
  const user = req.user as any;

  if (!comment) return res.status(404).send("Comment not found");
  if (comment.creator.id !== user.id) return res.status(403).send("Unauthorized");

  await database.editComment(commentId, req.body.description);
  
  res.redirect(`/posts/show/${comment.postId}`);
});

// Todo GET -- completed
router.get("/deleteconfirm/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);
  const comment = await database.getComment(commentId);
  const user = req.user as any;

  if (!comment) return res.status(404).send("Comment not found");
  if (comment.creator.id !== user.id) return res.status(403).send("Unauthorized");

  res.send(`
    <div style="padding: 2rem; text-align: center; font-family: sans-serif;">
        <h1>Delete Comment?</h1>
        <p>"${comment.description}"</p>
        <form action="/comments/delete/${comment.id}" method="POST">
            <button type="submit" style="background: red; color: white; padding: 10px 20px; border: none; cursor: pointer;">Yes, Delete</button>
        </form>
        <br>
        <a href="/posts/show/${comment.postId}">Cancel</a>
    </div>
  `);
});

// Todo POST -- completed
router.post("/delete/:id", ensureAuthenticated, async (req: Request, res: Response) => {
  const commentId = Number(req.params.id);
  const comment = await database.getComment(commentId);
  const user = req.user as any;

  if (!comment) return res.status(404).send("Comment not found");
  if (comment.creator.id !== user.id) return res.status(403).send("Unauthorized");

  await database.deleteComment(commentId);
  res.redirect(`/posts/show/${comment.postId}`);
});

export default router;