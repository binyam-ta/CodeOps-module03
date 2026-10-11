export default function MenuLoading() {
  return (
    <div
      className="menu-status-container loading"
      style={{
        minHeight: "45vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        margin: "3rem auto",
      }}
      role="status"
      aria-live="polite"
    >
      <div className="spinner" aria-hidden="true" />
      <p className="loading-message">Preparing the Addis Eats menu...</p>
    </div>
  );
}
