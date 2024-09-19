const endPoints = {
  //auth
  signup: "/auth/signup",
  login: "/auth/login",

  //category
  getAllCategories: "/category",
  createCategory: "/category/create",
  updateCategory: "/category/",
  deleteCategory: "/category/",

  //artwork
  artwork: "/artwork/",
  getArtworkByCategory: "/artwork/category?categoryId=",
};

export default endPoints;
