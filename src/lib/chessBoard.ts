import { HighlightColor } from "@/lib/types";

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
