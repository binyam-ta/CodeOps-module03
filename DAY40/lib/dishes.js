// Centralized dish dataset for Addis Eats
export const dishes = [
  {
    id: 1,
    slug: "buna",
    name: "Buna",
    price: 80,
    description:
      "Traditional Ethiopian coffee prepared with freshly roasted green beans brewed slowly in a clay jebena.",
    category: "Drink",
    spicy: false,
    isSpecial: true,
    image:
      "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 2,
    slug: "shiro",
    name: "Shiro",
    price: 150,
    description:
      "Slow-cooked chickpea flour stew seasoned with berbere spice and garlic, served bubbling hot with fresh injera.",
    category: "Main",
    spicy: true,
    isSpecial: true,
    image:
      "https://th.bing.com/th/id/OIP._6v2LlOOljVU505SewV8lgHaHa?w=180&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 3,
    slug: "tibs",
    name: "Tibs",
    price: 250,
    description:
      "Sautéed tender beef cubes with onions, tomatoes, and sliced green peppers served on warm sourdough teff injera.",
    category: "Main",
    spicy: true,
    isSpecial: true,
    image:
      "https://th.bing.com/th/id/OIP.6PvZVFWaZ-OMGbG6O2wilQHaF7?w=228&h=182&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 4,
    slug: "firfir",
    name: "Firfir",
    price: 100,
    description:
      "Shredded injera simmered in a rich, spicy berbere sauce with clarified spiced butter (niter kibbeh).",
    category: "Breakfast",
    spicy: true,
    isSpecial: false,
    image:
      "https://th.bing.com/th/id/OIP.EYFb85zh_6EHK6ldQxFVywHaEK?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 5,
    slug: "doro-wat",
    name: "Doro Wat",
    price: 280,
    description:
      "Ethiopia's signature celebratory chicken stew slow-cooked with boiled eggs, caramelized onions, and heritage berbere.",
    category: "Main",
    spicy: true,
    isSpecial: true,
    image:
      "https://th.bing.com/th/id/OIP.eiwztSL57PslAC4AqpBzMAHaE6?w=328&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 6,
    slug: "baklava",
    name: "Baklava",
    price: 120,
    description:
      "Sweet layered phyllo pastry filled with crushed walnuts and almonds, drizzled with golden honey syrup.",
    category: "Dessert",
    spicy: false,
    isSpecial: false,
    image:
      "https://th.bing.com/th/id/OIP.TQRz987Sv_vNTXuBZ_N3GQHaE7?w=233&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 7,
    slug: "mango-juice",
    name: "Mango Juice",
    price: 90,
    description:
      "Freshly pressed organic Ethiopian mango puree served chilled, naturally thick and sweet.",
    category: "Drink",
    spicy: false,
    isSpecial: false,
    image:
      "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=400&fit=crop&q=80",
  },
  {
    id: 8,
    slug: "chechebsa",
    name: "Chechebsa",
    price: 110,
    description:
      "Torn pan-fried kitta flatbread tossed with aromatic niter kibbeh spiced butter and a hint of berbere.",
    category: "Breakfast",
    spicy: false,
    isSpecial: false,
    image:
      "https://th.bing.com/th/id/OIP.63NdS3aecJ_RIoTPkFUVhQHaE8?w=280&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
  },
  {
    id: 9,
    slug: "kitfo",
    name: "Kitfo",
    price: 320,
    description:
      "Finely minced lean beef infused with fiery mitmita chili powder and purified niter kibbeh, served with ayib cottage cheese and kocho.",
    category: "Main",
    spicy: true,
    isSpecial: true,
    image:
      "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
  },
];

/**
 * Server-side data-access helper to fetch all dishes or filter by category.
 * Used directly by Server Components (no unnecessary internal HTTP roundtrips).
 */
export async function getDishes(category) {
  if (!category || category.toLowerCase() === "all") {
    return dishes;
  }
  return dishes.filter(
    (dish) => dish.category.toLowerCase() === category.toLowerCase()
  );
}

/**
 * Server-side data-access helper to fetch a single dish by id or slug.
 */
export async function getDishById(idOrSlug) {
  if (!idOrSlug) return null;
  const target = String(idOrSlug).toLowerCase().trim();
  return (
    dishes.find(
      (dish) =>
        String(dish.id).toLowerCase() === target ||
        dish.slug?.toLowerCase() === target ||
        dish.name?.toLowerCase().replace(/\s+/g, "-") === target ||
        dish.name?.toLowerCase() === target
    ) || null
  );
}

/**
 * Fetch today's featured dishes for the homepage specials section.
 */
export async function getTodaySpecials() {
  return dishes.filter((dish) => dish.isSpecial);
}

export default dishes;
