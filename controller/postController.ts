import * as db from "../fake-db";

// Todo: fix fake-db error -- completed
async function getPosts(n: number = 20, sub: string | undefined = undefined, orderBy: 'date' | 'votes' = 'date') {
  return db.getPosts(n, sub as any, orderBy);
}

async function getPost(id: number) {
  return db.getPost(id);
}

async function addPost(title: string, link: string, creator: number, description: string, subgroup: string) {
  return db.addPost(title, link, creator, description, subgroup);
}

async function editPost(id: number, changes: any) {
  return db.editPost(id, changes);
}

async function deletePost(id: number) {
  return db.deletePost(id);
}

async function getSubs() {
  return db.getSubs();
}

async function addComment(postId: number, creator: number, description: string) {
  return db.addComment(postId, creator, description);
}

async function votePost(postId: number, userId: number, value: number) {
    return db.processVote(postId, userId, value);
}

async function getComment(id: number) {
  return db.getComment(id);
}

async function editComment(id: number, description: string) {
  return db.editComment(id, description);
}

async function deleteComment(id: number) {
  return db.deleteComment(id);
}

export { 
    getPosts, 
    getPost, 
    addPost, 
    editPost, 
    deletePost, 
    getSubs,
    addComment,
    votePost,
    getComment,
    editComment,
    deleteComment
};