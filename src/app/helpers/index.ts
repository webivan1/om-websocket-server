import { ComputeBoundsType, LatLngType } from "../types";

export const EARTH_RADIUS = 6378245;

export function deg2rad(degree: number): number {
  return degree * (Math.PI / 180);
}

export function rad2deg(degree: number): number {
  return degree * (180 / Math.PI);
}

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

/**
 * @param {LatLngType} point
 * @param {number} distance - meters
 * @return {ComputeBoundsType}
 */
export function computeBounds({ lat, lng }: LatLngType, distance: number): ComputeBoundsType {
  const latRadiansDistance = distance / EARTH_RADIUS;
  const latDegreesDistance = rad2deg(latRadiansDistance);
  const lngDegreesDistance = rad2deg(latRadiansDistance / Math.cos(deg2rad(lat)));

  const swLat = lat - latDegreesDistance;
  const swLng = lng - lngDegreesDistance;

  const neLat = lat + latDegreesDistance;
  const neLng = lng + lngDegreesDistance;

  return {
    from: { lat: swLat, lng: swLng },
    to: { lat: neLat, lng: neLng }
  };
}