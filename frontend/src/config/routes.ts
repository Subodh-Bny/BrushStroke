const routes = {
  landing: { home: "/", about: "/about", contact: "/contact" },
  auth: { login: "/auth/login", signup: "/auth/signup" },
  artworks: "/artworks",
  artworkByCategoryId: "/artworks/category/",
  cart: "/cart",
  orders: "/orders",
  admin: {
    dashboard: "/admin",
    artworks: { add: "/admin/artwork/add", view: "/admin/artwork/" },
    orders: "/admin/orders",
    categories: "/admin/category",
  },

  khaltiReturn: "/payment/",
};

export default routes;
