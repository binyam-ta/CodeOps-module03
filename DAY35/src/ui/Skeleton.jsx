 // Loading skeletons for lazy-loaded route transitions under React.Suspense.
export function CheckoutSkeleton() {
  return (
    <div className="checkout-page" aria-busy="true" aria-label="Loading checkout">
      <div className="checkout-container">
        <div className="skeleton-banner skeleton-pulse" />

        <div className="checkout-layout">
          {/* Form Skeleton */}
          <div className="checkout-form-column">
            <div className="skeleton-card">
              <div className="skeleton-title skeleton-pulse" />
              <div className="skeleton-input skeleton-pulse" />
              <div className="skeleton-input skeleton-pulse" />
              <div className="skeleton-input skeleton-pulse" />
              <div className="skeleton-button skeleton-pulse" />
            </div>
          </div>

          {/* Summary Sidebar Skeleton */}
          <aside className="checkout-summary-column">
            <div className="skeleton-card">
              <div className="skeleton-title skeleton-pulse" />
              <div className="skeleton-line skeleton-pulse" />
              <div className="skeleton-line skeleton-pulse" />
              <div className="skeleton-line skeleton-pulse" />
              <div className="skeleton-total skeleton-pulse" />
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="page-skeleton-container" aria-busy="true" aria-label="Loading page">
      <div className="skeleton-banner skeleton-pulse" />
      <div className="skeleton-card skeleton-pulse" style={{ height: "260px", margin: "2rem auto", maxWidth: "900px" }} />
    </div>
  );
}

export default CheckoutSkeleton;
