import React from "react";
import { ThreeDots } from "react-loader-spinner";

const Loading = () => {
  return (
    <div
      style={{
        color: "red",
        position: "absolute",
        top: "40px",
        left: "30%",
        transform: "translate(-50%)",
      }}
    >
      <ThreeDots
        height="60"
        width="60"
        radius="9"
        color="#51E5FF"
        ariaLabel="three-dots-loading"
        visible={true}
      />
    </div>
  );
};

export default Loading;
