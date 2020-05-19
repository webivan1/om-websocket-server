export type IdType = string;

export type LatLngType = {
  lat: number;
  lng: number;
};

export type ConnectionType = LatLngType & {
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
}