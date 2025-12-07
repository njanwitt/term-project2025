import express, { Request, Response } from "express";
import * as database from "../controller/postController";
import { ensureAuthenticated } from "../middleware/checkAuth";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const orderBy = req.query.orderby === 'votes' ? 'votes' : 'date';
  const posts = await database.getPosts(20, undefined, orderBy);
  const user = req.user;
  res.render("posts", { posts, user, orderBy });
});

router.get("/create", ensureAuthenticated, (req: Request, res: Response) => {
  res.render("createPosts", { user: req.user });
});

router.post("/create", ensureAuthenticated, async (req: Request, res: Response) => {
  const { title, link, description, subgroup } = req.body;
  const user = req.user as any; 
  
  if (!title || (!link && !description) || !subgroup) {
      return res.redirect('/posts/create');
  }

  const newPost = await database.addPost(title, link, user.id, description, subgroup);
  res.redirect(`/posts/show/${newPost.id}`);
});

router.get("/show/:postid", async (req: Request, res: Response) => {
  const postId = req.params.postid;
  const post = await database.getPost(Number(postId));
  const user = req.user;
  
  if (!post) {
      return res.status(404).send("Post not found");
  }

  res.render("individualPost", { post, user });
});

router.get("/edit/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
  const post = await database.getPost(Number(req.params.postid));
  const user = req.user as any;

  if (!post) return res.status(404).send("Post not found");

  if (post.creator.id !== user.id) {
      return res.status(403).send("You are not authorized to edit this post.");
  }
  
  res.render("createPosts", { user, post });
});

router.post("/edit/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
    const post = await database.getPost(Number(req.params.postid));
    const user = req.user as any;
    
    if (!post) return res.status(404).send("Post not found");
    if (post.creator.id !== user.id) return res.status(403).send("Unauthorized");

    await database.editPost(Number(req.params.postid), req.body);
    res.redirect(`/posts/show/${post.id}`);
});

router.get("/deleteconfirm/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
    const post = await database.getPost(Number(req.params.postid));
    const user = req.user as any;

    if (!post) return res.status(404).send("Post not found");
    if (post.creator.id !== user.id) return res.status(403).send("Unauthorized");
    
    res.send(`
        <div style="padding: 2rem; font-family: sans-serif; text-align: center;">
            <h1>Delete Post?</h1>
            <p>Are you sure you want to delete <strong>"${post.title}"</strong>?</p>
            <form action="/posts/delete/${post.id}" method="POST">
                <button type="submit" style="background: #d93526; color: white; padding: 10px 20px; border: none; cursor: pointer; border-radius: 5px;">Yes, Delete It</button>
            </form>
            <br>
            <a href="/posts/show/${post.id}">Cancel</a>
        </div>
    `);
});

router.post("/delete/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
    const post = await database.getPost(Number(req.params.postid));
    const user = req.user as any;

    if (!post) return res.status(404).send("Post not found");
    if (post.creator.id !== user.id) return res.status(403).send("Unauthorized");

    const sub = post.subgroup;
    await database.deletePost(post.id);
    res.redirect(`/subs/show/${sub}`);
});

router.post("/comment-create/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
    const postId = Number(req.params.postid);
    const user = req.user as any;
    const { description } = req.body;

    if (description) {
        await database.addComment(postId, user.id, description);
    }
    res.redirect(`/posts/show/${postId}`);
});

router.post("/vote/:postid", ensureAuthenticated, async (req: Request, res: Response) => {
    const user = req.user as any;
    const postId = Number(req.params.postid);
    const voteValue = Number(req.body.setvoteto); 
    
    await database.votePost(postId, user.id, voteValue);

    if (req.headers.accept && req.headers.accept.includes('application/json')) {
        const updatedPost = await database.getPost(postId);
        let newCount = 0;
        if (updatedPost && updatedPost.votes) {
            updatedPost.votes.forEach((v: any) => newCount += v.value);
        }
        return res.json({ success: true, newCount, userVote: voteValue });
    }

    res.redirect(`/posts/show/${postId}`);
});

export default router;