import React from "react";
import Marquee from "react-fast-marquee";

const MarqueeConfig = () => {
  const [start, setStart] = useState(false);

  const handleStartMarquee = () => {
    setStart(true);
  };
  return <Marquee play={start} pauseOnHover={handleStartMarquee}></Marquee>;
};

export default MarqueeConfig;
