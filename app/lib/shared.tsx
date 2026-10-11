import {
  TrainFront,
  BusFront,
  TramFront,
  SquareM,
  CarTaxiFront,
} from "lucide-react";

export const transportModeIcons: Record<string, React.ReactNode> = {
  TRAIN: <TrainFront />,
  BUS: <BusFront />,
  TRAM: <TramFront />,
  METRO: <SquareM />,
  TAXI: <CarTaxiFront />,
};
