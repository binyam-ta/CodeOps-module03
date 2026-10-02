import Link from "next/link";
import { Dish as DishType } from "@/lib/types";

interface DishProps {
  id: string | number;
  name: string;
  price: number;
  currency?: string;
  spicy?: boolean;
  description?: string;
  category?: string;
  image?: string;
  onAdd?: (dish: DishType) => void;
}

export default function Dish({
  id,
  name,
  price,
  currency = "ETB",
  spicy = false,
  description,
  category,
  image,
  onAdd,
}: DishProps) {
  const priceWithTax = (price * 1.15).toFixed(0);

  return (
    <div className="dish">
      {image && (
        <Link href={`/menu/${id}`} className="dish-image-link" aria-label={`View ${name} details`}>
          <div className="dish-image">
            <img src={image} alt={name} loading="lazy" />
          </div>
        </Link>
      )}
      <div className="dish-body">
        <div className="dish-header">
          <h3 className="dish-name">
            <Link href={`/menu/${id}`} className="dish-title-link">
              {name}
            </Link>{" "}
            {Boolean(spicy) && <span className="spicy-badge">• Spicy</span>}
          </h3>
          {category && <span className="dish-category">{category}</span>}
        </div>
        {description && <p className="dish-description">{description}</p>}
        <div className="dish-footer">
          <div className="dish-pricing">
            <span className="dish-price">
              {price} {currency}
            </span>
            <span className="dish-tax">Incl. tax: {priceWithTax} {currency}</span>
          </div>
          {onAdd && (
            <button
              type="button"
              className="dish-add-btn"
              onClick={() => onAdd({ id, name, price, category: category || "", description: description || "", image, spicy })}
              aria-label={`Add ${name} to order`}
            >
              + Add
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
