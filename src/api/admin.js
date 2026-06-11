import service from "@/utils/requests";

export function login(data) {
  return service.post("/user/login", data);
}

export function categoryTree() {
  return service.get("/knowledge/category/tree");
}

export function getArticlePage(data) {
  return service.get("/knowledge/article/page", {
    params: data,
  });
}

export function uploadFile(file, businessInfo) {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("businessType", "ARTICLE");
  formData.append("businessId", businessInfo.id || "");
  formData.append("businessField", "cover");

  return service.post("/file/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
}

export function createArticle(data) {
  return service.post("/knowledge/article", data);
}

export function getArticleDetail(id) {
  return service.get(`/knowledge/article/${id}`);
}

export function updateArticle(id, data) {
  return service.put(`/knowledge/article/${id}`, data);
}

//退出登录
export function logout(){
    return service.post('/user/logout')
}