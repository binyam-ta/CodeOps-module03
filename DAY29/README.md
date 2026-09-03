# Addis Café (Addis Eats) — Interactive Ordering Screen

A clean, modern, realistic Ethiopian restaurant menu and TeleBirr ordering application built with React, Vite, PropTypes, and state-driven architecture.

## Technologies

- **React 19**
- **Vite**
- **PropTypes**
- **CSS3** (Custom Properties, Flexbox, Responsive Grid)

## Interactive Features & Component Architecture

Every interactive feature is driven purely by React component state — no direct DOM manipulation anywhere:

1. **`Menu` (`src/Menu.jsx`)**:
   - **Lowest Common Ancestor State**: Owns `category` state and `orderTotal` / `orderItems` state.
   - Derives the filtered dishes list dynamically whenever category changes.
   - Coordinates `CategoryBar`, `DishList`, live order total banner, and `OrderForm`.

2. **`CategoryBar` (`src/CategoryBar.jsx`)**:
   - Stateless component receiving `categories`, `selected`, and `onSelect` as props.
   - Interactive category chips ("All", "Main", "Breakfast", "Drink", "Dessert") with visual active state styling.

3. **`DishList` (`src/DishList.jsx`)**:
   - Renders the derived filtered list using `Card` and `Dish` components.
   - Keyed by stable unique `item.id` (never array indices).
   - Renders a clean empty state when no dishes match a category.

4. **`Dish` (`src/Dish.jsx`)**:
   - Well-typed component with PropTypes (`name` & `price` required, `spicy` optional bool, default `currency = "ETB"`).
   - Conditionally renders spicy badge with boolean guard (`Boolean(spicy) && ...`) to prevent stray `0` rendering.
   - Interactive "+ Add" button triggering the order total increment.

5. **`Card` (`src/Card.jsx`)**:
   - Reusable card wrapper component utilizing the `children` prop pattern with PropTypes validation.

6. **`OrderForm` (`src/OrderForm.jsx`)**:
   - **Controlled Form**: `name`, `phone`, and `area` managed in a single state object.
   - State updates use the object spread operator (`...prev`) ensuring immutable state transitions.
   - **Live TeleBirr Number Validation**: Regex `/^(?:\+251|0)[97]\d{8}$/` accepts `0911223344`, `0711223344`, `+251911223344`, and `+251711223344`, while rejecting invalid formats.
   - Live visual validation feedback and disabled checkout button until all validation checks pass and order total > 0.
   - Generates an order confirmation receipt upon submission.

7. **`data.js` (`src/data.js`)**:
   - Exports static array of dishes (`id`, `name`, `price`, `category`, `spicy`, `description`, and `image`).


## How to Run

```bash
# Install dependencies
npm install

# Start Vite development server
npm run dev

# Build for production
npm run build
```

