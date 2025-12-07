import express, { Request, Response, NextFunction } from "express";
import passport from "../middleware/passport";
import { registerUser } from "../controller/userController";

const router = express.Router();

router.get("/login", async (req: Request, res: Response) => {
  res.render("login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    successRedirect: "/posts",
    failureRedirect: "/auth/login",
  })
);

router.get("/logout", (req: Request, res: Response, next: NextFunction) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

// REGISTER 
router.get("/register", (req: Request, res: Response) => {
  res.render("register");
});

router.post("/register", async (req: Request, res: Response) => {
  const { uname, password } = req.body;
  
  if (!uname || !password) {
      return res.render("register", { error: "Please provide your username and password." });
  }

  const user = await registerUser(uname, password);
  
  if (user) {
    res.redirect("/auth/login");
  } else {
    res.render("register", { error: "Username already exists." });
  }
});

export default router;