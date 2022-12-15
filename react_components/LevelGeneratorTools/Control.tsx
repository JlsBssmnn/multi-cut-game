import { Slider, TextField, Typography } from "@mui/material";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export interface ControlProps {
  name: string;
  min: number;
  max?: number;
  defaultValue?: number;
  sliderMin?: number;
  sliderMax?: number;
  sliderStep?: number;
  setter: Dispatch<SetStateAction<number>>;
}

export default function Control(props: ControlProps) {
  const { name, min, max, sliderStep, setter } = props;
  const sliderMax = props.sliderMax ?? max;
  const sliderMin = props.sliderMin ?? min;
  const defaultValue = props.defaultValue ?? min;

  const [state, setState] = useState<string>(String(defaultValue));

  useEffect(() => {
    setter(defaultValue);
  }, []);

  function updateState(value: string) {
    setState(value);

    const n = Number(value);
    setter(Number.isNaN(n) ? defaultValue : n);
  }

  return (
    <>
      <Typography sx={{ textAlign: "right" }} variant="h6">
        {name + ":"}
      </Typography>
      <TextField
        size="small"
        type="number"
        inputProps={{ min, max }}
        value={state}
        onChange={(e) => updateState(e.target.value)}
      />
      <Slider
        size="small"
        valueLabelDisplay="auto"
        min={sliderMin}
        max={sliderMax}
        step={sliderStep}
        value={Number(state)}
        onChange={(_, newValue) => updateState(String(newValue))}
      />
    </>
  );
}
