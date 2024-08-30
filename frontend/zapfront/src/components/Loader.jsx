import React, { useEffect, useRef } from "react";
import lottie from "lottie-web";
import animationData from "../assets/images/X0noPS8CRu.json";

export default function Loader() {
  const container = useRef(null);

  useEffect(() => {
    lottie.loadAnimation({
      container: container.current,
      renderer: "svg",
      loop: true,
      autoplay: true,
      animationData: animationData,
    });
  }, []);

  return (
    <div className="flex justify-center items-center h-screen">
      <div ref={container} className=" w-auto h-[150px]"></div>
    </div>
  );
}