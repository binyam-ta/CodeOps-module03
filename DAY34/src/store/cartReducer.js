/**
 * Pure cart reducer managing shopping cart transitions.
 * Does not store derived values like total — total is derived in CartProvider.
 *
 * Actions handled:
 * - "add": Appends action.dish to items
 * - "remove": Removes dish matching action.id
 * - "clear": Resets items to an empty array
 *
 * @param {{ items: Array }} state - Current cart state
 * @param {{ type: string, dish?: Object, id?: number|string }} action - Dispatched action
 * @returns {{ items: Array }} Next state
 */
export const initialCartState = { items: [] };

export function cartReducer(state, action) {
  switch (action.type) {
    case "add":
      return {
        ...state,
        items: [...state.items, action.dish],
      };

    case "remove":
      return {
        ...state,
        items: state.items.filter((dish) => dish.id !== action.id),
      };

    case "clear":
      return {
        ...state,
        items: [],
      };

    default:
      throw new Error(`Unknown action type: ${action.type}`);
  }
}

export default cartReducer;
