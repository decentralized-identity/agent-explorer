import React from 'react'

const getScreenSize = () => ({
  width: window.innerWidth,
  height: window.innerHeight
});

export const useResize = () => {
  const [size, setSize] = React.useState(getScreenSize());

  React.useEffect(() => {
    const onResize = () => setSize(getScreenSize());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return size;
};
