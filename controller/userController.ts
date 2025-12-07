import * as db from "../fake-db";

export const getUserByEmailIdAndPassword = async (
  uname: string,
  password: string
) => {
  let user = await db.getUserByUsername(uname);
  if (user) {
    if (user.password === password) {
      return user;
    } else {
      return null;
    }
  }
  return null;
};

export const getUserById = async (id: string | number) => {
  let user = await db.getUser(Number(id));
  if (user) {
    return user;
  }
  return null;
};

// registration
export const registerUser = async (uname: string, password: string) => {
  const existingUser = await db.getUserByUsername(uname);
  if (existingUser) {
    // if user exists
    return null; 
  }
  return db.addUser(uname, password);
};