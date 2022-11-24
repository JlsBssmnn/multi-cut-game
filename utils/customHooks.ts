import { useLayoutEffect, useState } from "react";

/**
 * A hook for accessing the width and height of the window.
 * Credit: https://stackoverflow.com/a/19014495
 */
export function useWindowSize() {
  const [size, setSize] = useState([0, 0]);
  useLayoutEffect(() => {
    function updateSize() {
      setSize([
        document.documentElement.clientWidth,
        document.documentElement.clientHeight,
      ]);
    }
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => {
      window.removeEventListener("resize", updateSize);
    };
  }, []);
  return size;
}
