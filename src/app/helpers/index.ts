import { ComputeBoundsType, LatLngType } from "../types";

export function fakeCoordinates(point: LatLngType): LatLngType {
  const value = (Math.random() * 10) >= 5 ? 1 : -1;
  return {
    lat: point.lat + (Math.random() / 4 * value),
    lng: point.lng + (Math.random() / 3 * value)
  };
}

export function isPointBetweenPoints(connection: LatLngType, border: ComputeBoundsType): boolean {
  return (border.from.lat <= connection.lat && border.from.lng <= connection.lng) &&
    (border.to.lat >= connection.lat && border.to.lng >= connection.lng);
}