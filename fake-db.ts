// Todo -- need to use seed -- completed
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function getUser(id: number) {
  return prisma.user.findUnique({
    where: { id },
  });
}

async function getUserByUsername(uname: string) {
  return prisma.user.findUnique({
    where: { uname },
  });
}

async function getPosts(n = 20, sub: string | undefined = undefined, orderBy: 'date' | 'votes' = 'date') {
  const options: any = {
    take: n,
    include: {
      creator: true,
      votes: true,
      comments: { include: { creator: true } },
    },
  };

  if (sub) {
    options.where = { subgroup: sub };
  }

  if (orderBy === 'votes') {
    options.orderBy = {
        votes: {
            _count: 'desc'
        }
    };
  } else {
    options.orderBy = { timestamp: "desc" };
  }

  return prisma.post.findMany(options);
}

async function getPost(id: number) {
  return prisma.post.findUnique({
    where: { id },
    include: {
      creator: true,
      votes: true,
      comments: { 
        include: { creator: true },
        orderBy: { timestamp: "desc" }
      },
    },
  });
}

async function addPost(
  title: string,
  link: string,
  creator: number,
  description: string,
  subgroup: string
) {
  return prisma.post.create({
    data: {
      title,
      link,
      description,
      creatorId: Number(creator),
      subgroup,
    },
  });
}

async function editPost(post_id: number, changes: any) {
  return prisma.post.update({
    where: { id: post_id },
    data: changes,
  });
}

async function deletePost(post_id: number) {
  return prisma.post.delete({
    where: { id: post_id },
  });
}

async function getSubs() {
  const posts = await prisma.post.findMany({
    select: { subgroup: true },
    distinct: ["subgroup"],
  });
  return posts.map((p: any) => p.subgroup);
}

async function addComment(post_id: number, creator: number, description: string) {
  return prisma.comment.create({
    data: {
      description,
      creatorId: Number(creator),
      postId: Number(post_id),
    },
  });
}

async function processVote(post_id: number, user_id: number, value: number) {
  const postId = Number(post_id);
  const userId = Number(user_id);

  const existingVote = await prisma.vote.findUnique({
    where: {
      userId_postId: { userId, postId },
    },
  });

  if (existingVote) {
    if (existingVote.value === value) {
      await prisma.vote.delete({ where: { id: existingVote.id } });
    } else {
      await prisma.vote.update({
        where: { id: existingVote.id },
        data: { value },
      });
    }
  } else {
    await prisma.vote.create({
      data: { value, userId, postId },
    });
  }
}

async function addUser(uname: string, password: string) {
  return prisma.user.create({
    data: { uname, password },
  });
}

async function getComment(id: number) {
  return prisma.comment.findUnique({
    where: { id },
    include: { creator: true }
  });
}

async function editComment(id: number, description: string) {
  return prisma.comment.update({
    where: { id },
    data: { description }
  });
}

async function deleteComment(id: number) {
  return prisma.comment.delete({
    where: { id }
  });
}

// setup account in case we forget
async function seed() {
  const njanwitt = await prisma.user.findUnique({ where: { uname: "njanwitt" } });
  if (!njanwitt) {
    console.log(" Empty Database... Creating user 'njanwitt'...");
    await prisma.user.create({
      data: {
        uname: "njanwitt",
        password: "najanwit",
        posts: {
          create: {
            title: "Welcome to your new Database!",
            subgroup: "general",
            description: "We're using real SQLite.",
          },
        },
      },
    });
  }
}
seed();

export {
  getUser,
  getUserByUsername,
  getPosts,
  getPost,
  addPost,
  editPost,
  deletePost,
  getSubs,
  addComment,
  processVote,
  addUser,
  getComment,
  editComment,
  deleteComment
};