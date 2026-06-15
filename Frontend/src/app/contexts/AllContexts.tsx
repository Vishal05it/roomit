"use client";
type Context = {
  allRooms: Room[];
  setAllRooms: React.Dispatch<SetStateAction<Room[]>>;
  pageLoading: boolean;
  setPageLoading: React.Dispatch<SetStateAction<boolean>>;
  allBookings: Booking[];
  setAllBookings: React.Dispatch<SetStateAction<Booking[]>>;
  userEmail: string;
  setUserEmail: React.Dispatch<SetStateAction<string>>;
  btnLoading: boolean;
  setBtnLoading: React.Dispatch<SetStateAction<boolean>>;
  room: Room;
  setRoom: React.Dispatch<SetStateAction<Room>>;
};
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
type Room = {
  _id: string;
  title: string;
  description: string;
  cleanTime: number;
  floor: number;
  capacity: number;
  image: string;
};
type Booking = {
  _id: string;
  date: string;
  slot: string;
  roomId: Room;
  bookedBy: string;
  cancelledAt: string;
  bookedAt: number;
  bookedByName: string;
  bookingTitle: string;
  status: "over" | "active" | "cancel";
  refundable: boolean;
};
const allContext = createContext<Context | null>(null);
function AllContexts({ children }: { children: ReactNode }) {
  const [allRooms, setAllRooms] = useState<Room[]>([]);
  const [allBookings, setAllBookings] = useState<Booking[]>([]);
  const [pageLoading, setPageLoading] = useState<boolean>(false);
  const [room, setRoom] = useState<Room>({
    _id: "",
    title: "",
    description: "",
    cleanTime: 0,
    capacity: 0,
    floor: 0,
    image: "",
  });
  const [btnLoading, setBtnLoading] = useState<boolean>(false);
  const storedEmail =
    typeof window !== "undefined" ? localStorage.getItem("userEmail") : null;
  const [userEmail, setUserEmail] = useState<string>(
    storedEmail ? JSON.parse(storedEmail) : "",
  );
  return (
    <allContext.Provider
      value={{
        allRooms,
        setAllRooms,
        pageLoading,
        setPageLoading,
        allBookings,
        setAllBookings,
        userEmail,
        setUserEmail,
        btnLoading,
        setBtnLoading,
        room,
        setRoom,
      }}
    >
      {children}
    </allContext.Provider>
  );
}
export const useAllContexts = () => {
  let context = useContext(allContext);
  if (!context) throw new Error("Wrap the React Node with the context");
  return context;
};
export default AllContexts;
