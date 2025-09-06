import { useEffect, useRef } from "react";

const VantaNetBackground = ({ theme }) => {
  const vantaRef = useRef(null);

  useEffect(() => {
    let effect = window.VANTA.NET({
      el: vantaRef.current,
      color: theme === "dark" ? 0x2e0ae0 : 0x899d89,
      backgroundColor: theme === "dark" ? 0x0 : 0xffffff,
      points: 16.0,
      maxDistance: 25.0,
      mouseControls: true,
      touchControls: true,
      showDots: theme === "dark",
    });

    return () => effect?.destroy();
  }, [theme]);

  return (
    <div
      ref={vantaRef}
      className="absolute top-0 left-0 w-full h-[2400px] -z-10"
    />
  );
};

export default VantaNetBackground;
