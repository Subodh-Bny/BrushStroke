const endPoints = {
  //auth
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",

  //category
  getAllCategories: "/category",
  createCategory: "/category/create",
  updateCategory: "/category/",
  deleteCategory: "/category/",

  //artwork
  artwork: "/artwork/",
  getArtworkByCategory: "/artwork/category?categoryId=",

  //cart
  cart: "/cart/",

  //order
  order: "/order/",

  //khalti
  khaltiInitiate: "/payment/initiate",
};

export default endPoints;
