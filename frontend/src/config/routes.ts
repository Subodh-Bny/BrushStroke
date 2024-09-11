interface RouteType {
  withName?: { href: string; name: string }[];
  withoutName?: {
    href: string;
  };
}
const routes: RouteType = {
  withName: [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "About",
      href: "/",
    },
    {
      name: "Contact",
      href: "/",
    },
  ],
};

export default routes;
