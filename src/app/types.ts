export type IdType = string;

export type ConnectionUserIdType = {
  userId: string;
}

export type LatLngType = {
  lat: number;
  lng: number;
};

export type NewConnectionType = ConnectionUserIdType & LatLngType;

export type ConnectionType = ConnectionUserIdType & LatLngType & {
  id: IdType
};

export type ComputeBoundsType = {
  from: LatLngType;
  to: LatLngType;
}

export type RequestQueryParamsType = {
  eventId: number;
  duration: number;
  finishedAt: number;
  startAt: number;
  timezone: string;
  borderFromLat: number,
  borderFromLng: number,
  borderToLat: number,
  borderToLng: number,
}