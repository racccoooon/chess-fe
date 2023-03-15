import { ChessBoardColor, HighlightColor } from "@/lib/types";

export const getSquareColorClass = (color: ChessBoardColor) => {
  switch (color) {
    case ChessBoardColor.Neutral:
      return `fill-gray-100 data-[dark=true]:fill-gray-500`;
    case ChessBoardColor.Wood:
      return `fill-brown-200 data-[dark=true]:fill-brown-500`;
    case ChessBoardColor.Green:
      return `fill-green-100 data-[dark=true]:fill-green-500`;
    case ChessBoardColor.Blue:
      return `fill-blue-200 data-[dark=true]:fill-blue-500`;
    case ChessBoardColor.Red:
      return `fill-red-200 data-[dark=true]:fill-red-500`;
    case ChessBoardColor.Orange:
      return `fill-orange-200 data-[dark=true]:fill-orange-400`;
    case ChessBoardColor.Purple:
      return `fill-purple-200 data-[dark=true]:fill-purple-500`;
    case ChessBoardColor.Pink:
      return `fill-pink-200 data-[dark=true]:fill-pink-400`;
    case ChessBoardColor.HighContrast:
      return `fill-white data-[dark=true]:fill-gray-800`;
    default:
      return `fill-white data-[dark=true]:fill-black`;
  }
};

export const getHighlightFillClass = (color: HighlightColor): string => {
  switch (color) {
    case HighlightColor.White:
      return "fill-gray-200 data-[dark=true]:fill-gray-50";
    case HighlightColor.Gray:
      return "fill-gray-300";
    case HighlightColor.Black:
      return "fill-gray-700";
    case HighlightColor.Red:
      return "fill-red-400";
    case HighlightColor.Orange:
      return "fill-orange-400";
    case HighlightColor.Yellow:
      return "fill-yellow-300";
    case HighlightColor.Green:
      return "fill-lime-400";
    case HighlightColor.Teal:
      return "fill-teal-300";
    case HighlightColor.LightBlue:
      return "fill-sky-300";
    case HighlightColor.Blue:
      return "fill-blue-400";
    case HighlightColor.Purple:
      return "fill-purple-400";
    case HighlightColor.Pink:
      return "fill-pink-300";
    default:
      return "fill-black";
  }
};
