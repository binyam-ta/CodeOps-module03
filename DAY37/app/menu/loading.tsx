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
    >
      <div className="spinner" />
      <p className="loading-message">Loading the menu...</p>
    </div>
  );
}
