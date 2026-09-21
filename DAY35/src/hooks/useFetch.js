// import { useState, useEffect } from "react";

// /**
//  * Custom hook that fetches data from an endpoint URL.
//  * Returns { data, loading, error } and aborts in-flight requests in cleanup.
//  *
//  * @param {string} url - Endpoint URL to fetch
//  * @returns {{ data: any, loading: boolean, error: string|null }}
//  */
// export function useFetch(url) {
//   const [data, setData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!url) {
//       setLoading(false);
//       return;
//     }

//     const controller = new AbortController();

//     async function fetchData() {
//       setLoading(true);
//       setError(null);

//       try {
//         const res = await fetch(url, { signal: controller.signal });
//         if (!res.ok) {
//           throw new Error(
//             `Could not load data (${res.status}: ${res.statusText || "Not Found"}). Please check if endpoint is available.`
//           );
//         }
//         const json = await res.json();
//         setData(json);
//       } catch (err) {
//         // Ignore AbortError when request was cancelled by cleanup
//         if (err.name !== "AbortError") {
//           setError(err.message || "An unexpected error occurred.");
//         }
//       } finally {
//         // Only turn off loading if request was not aborted by a newer one
//         if (!controller.signal.aborted) {
//           setLoading(false);
//         }
//       }
//     }

//     fetchData();

//     // Cleanup aborts in-flight requests when url changes or component unmounts
//     return () => {
//       controller.abort();
//     };
//   }, [url]);

//   return { data, loading, error };
// }

// export default useFetch;

import { useState, useEffect } from "react";

/**
 * Custom hook that fetches data from an endpoint URL.
 * Delays the request by 3 seconds.
 * Returns { data, loading, error }.
 */
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
        // Delay fetch by 3 seconds
        await new Promise((resolve, reject) => {
          const timeoutId = setTimeout(resolve, 3000);

          // Cancel delay if component unmounts
          controller.signal.addEventListener("abort", () => {
            clearTimeout(timeoutId);
            reject(new DOMException("Aborted", "AbortError"));
          });
        });

        const res = await fetch(url, {
          signal: controller.signal,
        });

        if (!res.ok) {
          throw new Error(
            `Could not load data (${res.status}: ${
              res.statusText || "Not Found"
            }). Please check if endpoint is available.`
          );
        }

        const json = await res.json();
        setData(json);
      } catch (err) {
        // Ignore AbortError
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