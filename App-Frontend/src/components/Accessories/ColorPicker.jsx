import { useState } from "react";
import { SketchPicker } from "react-color";

const ColorPicker = ({ color, setColor }) => {
  const handleChangeComplete = (color) => setColor(color.hex);
  return (
    <SketchPicker
      className="w-full"
      color={color}
      onChangeComplete={handleChangeComplete}
    />
  );
};

export default ColorPicker;
