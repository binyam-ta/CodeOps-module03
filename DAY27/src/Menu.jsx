// import MenuItem from "./MenuItem";

// const menu = [
//   {
//     id: 1,
//     name: "Buna",
//     price: 80,
//     description:
//       "Traditional Ethiopian coffee prepared with freshly roasted beans and served in a jebena.",
//     category: "Drink",
//     image:
//       "https://images.unsplash.com/photo-1611564494260-6f21b80af7ea?w=600&h=400&fit=crop&q=80",
//   },
//   {
//     id: 2,
//     name: "Shiro",
//     price: 150,
//     description:
//       "Slow-cooked chickpea stew seasoned with berbere spice, served with fresh injera.",
//     category: "Main",
//     image:
// "data:image/webp;base64,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"  },
//   {
//     id: 3,
//     name: "Tibs",
//     price: 250,
//     description:
//       "Sautéed beef with onions, tomatoes, and green peppers served on warm injera.",
//     category: "Main",
//     image:
// "https://th.bing.com/th/id/OIP.6PvZVFWaZ-OMGbG6O2wilQHaF7?w=229&h=184&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"  },
//   {
//     id: 4,
//     name: "Firfir",
//     price: 100,
//     description:
//       "Shredded injera simmered in a rich berbere sauce with spiced butter.",
//     category: "Breakfast",
//     image:
// "https://th.bing.com/th/id/OIP.EYFb85zh_6EHK6ldQxFVywHaEK?w=297&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"  },
//   {
//     id: 5,
//     name: "Doro Wat",
//     price: 280,
//     description:
//       "Ethiopia's signature spicy chicken stew slow-cooked with hard-boiled eggs and berbere.",
//     category: "Main",
//     image:
// "https://th.bing.com/th/id/OIP.eiwztSL57PslAC4AqpBzMAHaE6?w=328&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3"  },
//  {
//     id: 6,
//     name: "Baklava",
//     price: 120,
//     description:
//       "Sweet layered pastry filled with chopped nuts and drizzled with honey syrup.",
//     category: "Dessert",
//     image:
// "https://www.bing.com/images/search?view=detailV2&ccid=%2bnw9Dklw&id=C7B91066C28674E84299AFEE654C4F3A4D59BDF8&thid=OIP.-nw9Dklw8R9dwXQlQo4DIQHaNK&mediaurl=https%3a%2f%2fi.pinimg.com%2foriginals%2f1e%2f81%2fee%2f1e81eec285394393de37393f3fabc349.jpg&cdnurl=https%3a%2f%2fth.bing.com%2fth%2fid%2fR.fa7c3d0e4970f11f5dc17425428e0321%3frik%3d%252bL1ZTTpPTGXurw%26pid%3dImgRaw%26r%3d0&exph=1920&expw=1080&q=baklava+pintrest&FORM=IRPRST&ck=5F09D3CC6D53E283A4E1F859407F1D65&selectedIndex=1&itb=0"
//    }, 
//   {
//     id: 7,
//     name: "Mango Juice",
//     price: 90,
//     description:
//       "Freshly squeezed mango juice served chilled in a tall glass.",
//     category: "Drink",
//     image:
//       "https://images.unsplash.com/photo-1546173159-315724a31696?w=600&h=400&fit=crop&q=80",
//   },
//   {
//     id: 8,
//     name: "Chechebsa",
//     price: 110,
//     description:
//       "Crispy flatbread torn and tossed with spiced butter and a touch of berbere.",
//     category: "Breakfast",
//     image:
//       "https://th.bing.com/th/id/OIP.63NdS3aecJ_RIoTPkFUVhQHaE8?w=280&h=187&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3",
//   },
// ];

// function Menu() {
//   return (
//     <section className="menu-section" id="menu">
//       <div className="menu-intro">
//         <h2 className="menu-heading">Our Menu</h2>
//         <p className="menu-subtitle">
//           A selection of traditional Ethiopian dishes, fresh coffee, and local
//           favorites.
//         </p>
//       </div>
//       <div className="menu-grid">
//         {menu.map((item) => (
//           <MenuItem
//             key={item.id}
//             name={item.name}
//             price={item.price}
//             description={item.description}
//             category={item.category}
//             image={item.image}
//           />
//         ))}
//       </div>
//     </section>
//   );
// }

// export default Menu;

import PropTypes from "prop-types";
import { menu } from "./data";
import Card from "./Card";
import Dish from "./Dish";

function Menu({ selectedCategory = "All" }) {
  const filteredMenu =
    selectedCategory === "All"
      ? menu
      : menu.filter(
          (item) =>
            item.category.toLowerCase() === selectedCategory.toLowerCase()
        );

  return (

    <section className="menu-section" id="menu">
      <div className="menu-intro">
        <h2 className="menu-heading">Our Menu</h2>
        <p className="menu-subtitle">
          A selection of traditional Ethiopian dishes, fresh coffee, and local
          favorites.
        </p>
      </div>

      {filteredMenu.length === 0 ? (
        <div className="empty-state">
          <p className="empty-state-title">No dishes found</p>
          <p className="empty-state-text">
            There are no items matching this category at the moment.
          </p>
        </div>
      ) : (
        <div className="menu-grid">
          {filteredMenu.map((item) => (
            <Card key={item.id} className="menu-card">
              <Dish
                name={item.name}
                price={item.price}
                description={item.description}
                category={item.category}
                spicy={item.spicy}
                image={item.image}
              />
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}

Menu.propTypes = {
  selectedCategory: PropTypes.string,
};

export default Menu;
