import { CircleUserRound } from "lucide-react";
import React from "react";

const SidePanelHeadText = ({ textHead }) => {
  return (
    <div className="flex gap-3">
      <CircleUserRound />
      <h1>{textHead}</h1>
    </div>
  );
};

export default SidePanelHeadText;
