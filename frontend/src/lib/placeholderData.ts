// Mock data for existing categories
export const initialCategories: Category[] = [
  { _id: "1", name: "Paintings" },
  { _id: "2", name: "Sculptures" },
  { _id: "3", name: "Digital Art" },
];

export const artworks: Artwork[] = [
  {
    _id: "1",
    title: "Sunset Over the Mountains",
    artist: {
      _id: "123",
      username: "asdfasd",
      role: "ARTIST",
      email: "adsfasdf@asdf.sdvs",
      profilePic: "/notFound.jpg",
    },
    price: 250.0,
    category: "Paintings",
    image: "/hero2.jpg",
    description: "A beautiful depiction of a sunset over majestic mountains.",
    availability: true,
  },
  {
    _id: "2",
    title: "Ocean Waves",
    artist: {
      _id: "123",
      username: "asdfasd",
      role: "ARTIST",
      email: "adsfasdf@asdf.sdvs",
      profilePic: "/notFound.jpg",
    },
    price: 300.5,
    category: "Paintings",
    image: "/hero-3.jpg",
    description:
      "Capturing the beauty of the ocean waves crashing onto the shore.",
    availability: false,
  },
  {
    _id: "3",
    title: "Abstract Thoughts",
    artist: {
      _id: "123",
      username: "asdfasd",
      role: "ARTIST",
      email: "adsfasdf@asdf.sdvs",
      profilePic: "/notFound.jpg",
    },
    price: 150.75,
    category: "Abstract Art",
    image: "/hero1.jpg",
    description:
      "An abstract piece that represents the complexity of human thoughts.",
    availability: true,
  },
];
