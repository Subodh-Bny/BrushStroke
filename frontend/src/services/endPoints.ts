const endPoints = {
  //auth
  signup: "/auth/signup",
  login: "/auth/login",
  logout: "/auth/logout",

  //user
  users: "/user/",

  //category
  getAllCategories: "/category",
  createCategory: "/category/create",
  updateCategory: "/category/",
  deleteCategory: "/category/",

  //artwork
  artwork: "/artwork/",
  getArtworkByCategory: "/artwork/category?categoryId=",
  featuredArtwork: "/artwork/featured/",

  //cart
  cart: "/cart/",

  //order
  order: "/order/",
  getOrderByUserId: "/order/user/",
  updateOrderShippingStatus: "/order/shipping/status/",

  //khalti
  khaltiInitiate: "/payment/initiateKhalti",
  verifyKhalti: "/payment/verifyKhalti",

  //esewa
  generateSignature: "/payment/generate-esewa-signature",

  //payment details
  getPaymentDetails: "/payment/details",
  updatePaymentStatus: "/payment/status/",

  //analytics
  analytics: "/analytics/",
};

export default endPoints;
