import { useState, useEffect } from "react";

export function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!url) {
      setLoading(false);
      return;
    }

    const controller = new AbortController();

    async function fetchData() {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(url, { signal: controller.signal });
        if (!res.ok) {
          throw new Error(
            `Could not load data (${res.status}: ${res.statusText || "Not Found"}). Please check if endpoint is available.`
          );
        }
        const json = await res.json();
        setData(json);
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "An unexpected error occurred.");
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    }

    fetchData();

    return () => {
      controller.abort();
    };
  }, [url]);

  return { data, loading, error };
}

export default useFetch;
