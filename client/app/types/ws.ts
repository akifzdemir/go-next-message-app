export type RoomRequest = {
  name: string;
};

export type RoomResponse = RoomRequest & {
  id: string;
};
