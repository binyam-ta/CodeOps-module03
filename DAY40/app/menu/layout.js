export const metadata = {
  title: "Menu — Addis Eats Ethiopian Dining",
  description: "Browse traditional Ethiopian dishes, kitfo, doro wat, tibs, vegetarian shiro, and buna coffee.",
};

export default function MenuLayout({ children }) {
  return (
    <div className="menu-layout-wrapper">
      {children}
    </div>
  );
}
