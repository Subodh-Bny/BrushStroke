const routes = {
  landing: { home: "/", about: "/about", contact: "/contact" },
  auth: { login: "/auth/login", signup: "/auth/signup" },
  artworks: "/artworks",
  cart: "/cart",
  admin: {
    dashboard: "/admin",
    artworks: { add: "/admin/artwork/add", view: "/admin/artwork/" },
    orders: "/admin/orders",
    categories: "/admin/category",
  },
};

export default routes;
