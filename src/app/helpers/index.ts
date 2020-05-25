import { LatLngType } from "../types";

export const fakeCoordinates = (point: LatLngType): LatLngType => {
  const value = (Math.random() * 10) >= 5 ? 1 : -1;
  return {
    lat: point.lat + (Math.random() / 4 * value),
    lng: point.lng + (Math.random() / 3 * value)
  };
}