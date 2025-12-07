import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import {
  getUserByEmailIdAndPassword,
  getUserById,
} from "../controller/userController";

// Debug 
interface User {
    id: number;
    uname: string;
    password?: string;
}

const localLogin = new LocalStrategy(
  {
    usernameField: "uname",
    passwordField: "password",
  },
  async (uname: string, password: string, done: any) => {
    console.log(`🔍 DEBUG: Attempting login for user: "${uname}"`);
    
    // Check Database
    const user = await getUserByEmailIdAndPassword(uname, password);
    
    if (user) {
      console.log(`DEBUG: User found! ID: ${user.id}`);
      return done(null, user);
    } else {
      console.log(`DEBUG: Login Failed! User not found or password incorrect.`);
      return done(null, false, {
          message: "Your login details are not valid. Please try again.",
        });
    }
  }
);

passport.serializeUser(function (user: any, done: any) {
  console.log(`💾 DEBUG: Serializing User ID: ${user.id}`);
  done(null, user.id);
});

passport.deserializeUser(async function (id: string, done: any) {
  const user = await getUserById(id);
  if (user) {
    done(null, user);
  } else {
    console.log(`⚠️ DEBUG: Deserializing failed. ID ${id} not found in DB.`);
    done(null, false);
  }
});

export default passport.use(localLogin);