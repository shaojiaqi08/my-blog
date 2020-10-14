import fetchHelper from "./request";

export const getIndex = () => {
  return fetchHelper.get("/api/index");
};

export const getPost = () => {
  return fetchHelper.get("/api/postlist");
};

export const getCate = () => {
  return fetchHelper.get("/api/catelist");
};

export const register = data => {
  return fetchHelper.post("/api/register", data);
};

export const checkUser = data => {
  return fetchHelper.get("/api/checkUser?username=" + data);
};

export const login = (data = {}) => {
  return fetchHelper.post('/api/login', data)
}

export const about = () => {
  return fetchHelper.get('/api/comments')
}

export const insetComment = (data = {}) => {
  return fetchHelper.post('/api/insetComment', data)
}

export const replyPost = (data = {}) => {
  return fetchHelper.post('/api/reply', data)
}

export const getUserList = () => {
  return fetchHelper.get('/api/userList')
}

export const deleteUser = (data) => {
  return fetchHelper.post('/api/deleteUser', data)
}

export const changeTalk = (data) => {
  return fetchHelper.post('/api/changeTalk', data)
}

export const changeRole = (data) => {
  return fetchHelper.post('/api/changeRole', data)
}

export const userScreen = (data) => {
  return fetchHelper.get('/api/userScreen', data)
}

export const getPostDetail = (id) => {
  return fetchHelper.get('/api/postDetail/' + id)
}

export const addPost = (data={}) => {
  return fetchHelper.post('/api/addpost', data)
}

export const updatePost = (data = {}) => {
  return fetchHelper.post('/api/update', data)
}

export const delTag = (data) => {
  return fetchHelper.post('/api/delTag', data)
}

export const deleteAllTag = (dataList) => {
  return fetchHelper.post('/api/deleteAllTag', dataList)
}

export const delPost = (data) => {
  return fetchHelper.post('/api/deletePost', data)
}

export const searchPost = (data) => {
  return fetchHelper.post('/api/searchPost', data)
}

export const categoryDetail = (data) => {
  return fetchHelper.get('/api/categoryDetail/' + data.type)
}

export const search = (keywords) => {
  return fetchHelper.get('/api/search?keywords=' + keywords)
}

export const isHot = (data) => {
  return fetchHelper.post('/api/isHot', data)
}

