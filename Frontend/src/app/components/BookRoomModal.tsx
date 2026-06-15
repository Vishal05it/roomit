"use client";
import React, {
  SetStateAction,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAllContexts } from "../contexts/AllContexts";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import ButtonLoader from "../Loader/ButtonLoader";
import { slotParser } from "../../../utils/SlotParser";
//import Faah from "../../../public/Faah.mp3";
type Props = {
  roomId: string;
  setOpenBookModal: React.Dispatch<SetStateAction<boolean>>;
};
type Form = {
  email: string;
  slot: string;
  date: string;
  name: string;
  bookingTitle: string;
};
export default function BookRoomModal({ setOpenBookModal, roomId }: Props) {
  const audioRef = useRef<HTMLAudioElement>(null);
  let { userEmail, setAllBookings, btnLoading, setBtnLoading, allBookings } =
    useAllContexts();

  let onChangeFunc = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  let [slotLoad, setSlotLoad] = useState<boolean>(false);
  const [allSlots, setAllSlots] = useState<
    | {
        display: string;
        value: string;
      }[]
    | undefined[]
  >([
    { display: "12:00 PM - 12:30 PM", value: "12:00 - 12:30" },
    { display: "12:30 PM - 01:00 PM", value: "12:30 - 13:00" },
    { display: "01:00 PM - 01:30 PM", value: "13:00 - 13:30" },
    { display: "01:30 PM - 02:00 PM", value: "13:30 - 14:00" },
    { display: "02:00 PM - 02:30 PM", value: "14:00 - 14:30" },
    { display: "02:30 PM - 03:00 PM", value: "14:30 - 15:00" },
    { display: "03:00 PM - 03:30 PM", value: "15:00 - 15:30" },
    { display: "03:30 PM - 04:00 PM", value: "15:30 - 16:00" },
    { display: "04:00 PM - 04:30 PM", value: "16:00 - 16:30" },
    { display: "04:30 PM - 05:00 PM", value: "16:30 - 17:00" },
    { display: "05:00 PM - 05:30 PM", value: "17:00 - 17:30" },
    { display: "05:30 PM - 06:00 PM", value: "17:30 - 18:00" },
    { display: "06:00 PM - 06:30 PM", value: "18:00 - 18:30" },
    { display: "06:30 PM - 07:00 PM", value: "18:30 - 19:00" },
    { display: "07:00 PM - 07:30 PM", value: "19:00 - 19:30" },
    { display: "07:30 PM - 08:00 PM", value: "19:30 - 20:00" },
    { display: "08:00 PM - 08:30 PM", value: "20:00 - 20:30" },
    { display: "08:30 PM - 09:00 PM", value: "20:30 - 21:00" },
    { display: "09:00 PM - 09:30 PM", value: "21:00 - 21:30" },
    { display: "09:30 PM - 10:00 PM", value: "21:30 - 22:00" },
    { display: "10:00 PM - 10:30 PM", value: "22:00 - 22:30" },
    { display: "10:30 PM - 11:00 PM", value: "22:30 - 23:00" },
    { display: "11:00 PM - 11:30 PM", value: "23:00 - 23:30" },
    { display: "11:30 PM - 12:00 AM", value: "23:30 - 00:00" },
    { display: "12:00 AM - 12:30 AM", value: "00:00 - 00:30" },
    { display: "12:30 AM - 01:00 AM", value: "00:30 - 01:00" },
    { display: "01:00 AM - 01:30 AM", value: "01:00 - 01:30" },
    { display: "01:30 AM - 02:00 AM", value: "01:30 - 02:00" },
    { display: "02:00 AM - 02:30 AM", value: "02:00 - 02:30" },
    { display: "02:30 AM - 03:00 AM", value: "02:30 - 03:00" },
    { display: "03:00 AM - 03:30 AM", value: "03:00 - 03:30" },
    { display: "03:30 AM - 04:00 AM", value: "03:30 - 04:00" },
    { display: "04:00 AM - 04:30 AM", value: "04:00 - 04:30" },
    { display: "04:30 AM - 05:00 AM", value: "04:30 - 05:00" },
    { display: "05:00 AM - 05:30 AM", value: "05:00 - 05:30" },
    { display: "05:30 AM - 06:00 AM", value: "05:30 - 06:00" },
    { display: "06:00 AM - 06:30 AM", value: "06:00 - 06:30" },
    { display: "06:30 AM - 07:00 AM", value: "06:30 - 07:00" },
    { display: "07:00 AM - 07:30 AM", value: "07:00 - 07:30" },
    { display: "07:30 AM - 08:00 AM", value: "07:30 - 08:00" },
    { display: "08:00 AM - 08:30 AM", value: "08:00 - 08:30" },
    { display: "08:30 AM - 09:00 AM", value: "08:30 - 09:00" },
    { display: "09:00 AM - 09:30 AM", value: "09:00 - 09:30" },
    { display: "09:30 AM - 10:00 AM", value: "09:30 - 10:00" },
    { display: "10:00 AM - 10:30 AM", value: "10:00 - 10:30" },
    { display: "10:30 AM - 11:00 AM", value: "10:30 - 11:00" },
    { display: "11:00 AM - 11:30 AM", value: "11:00 - 11:30" },
    { display: "11:30 AM - 12:00 PM", value: "11:30 - 12:00" },
  ]);
  const [form, setForm] = useState<Form>({
    email: userEmail,
    slot: allSlots[0]?.value as string,
    date: "",
    name: "",
    bookingTitle: "",
  });
  let bookRoom = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(`${baseURL}/booking/api/bookroom/${roomId}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          bookedBy: form.email,
          slot: form.slot,
          date: form.date,
          name: form.name,
          bookingTitle: form.bookingTitle,
        }),
      });
      let bookData = await response.json();
      //console.log(bookData);
      if (bookData.success) {
        successEmitter(bookData.message);
        setAllBookings((prev) => [...prev, bookData.booking]);
        setOpenBookModal(false);
      } else {
        errorEmitter(bookData.message);
        audioRef?.current?.play();
      }
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  let checkSlots = async () => {
    try {
      setSlotLoad(true);
      let response = await fetch(
        `${baseURL}/booking/api/findslots/${form.date}/${roomId}`,
      );
      let slotData = await response.json();
      //console.log(slotData);
      if (slotData.success) {
        //successEmitter(slotData.message);
        setAllSlots(slotParser(slotData.slots));
        setForm({ ...form, slot: slotData.slots[0] });
        //console.log("Data received : ", slotData.slots);
      } else {
        errorEmitter(slotData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setSlotLoad(false);
    }
  };
  useMemo(() => {
    const fetchSlots = async () => {
      await checkSlots();
    };
    fetchSlots();
  }, [form.date]);
  useEffect(() => {
    allBookings.sort((a, b) => b.bookedAt - a.bookedAt);
  }, [allBookings]);
  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <audio ref={audioRef} src="/Faah.mp3" style={{ display: "none" }}></audio>
      <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-md">
        {/* Heading */}
        <h2 className="text-2xl font-semibold text-black">Book Room</h2>

        <p className="text-gray-600 mt-2">
          Fill in the details to reserve your meeting room.
        </p>

        {/* Email */}
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            await bookRoom();
          }}
        >
          <div className="mt-5">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>

            <input
              type="email"
              name="email"
              value={form.email}
              required
              onChange={onChangeFunc}
              placeholder="Enter your email"
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
            />
            <input
              type="text"
              name="name"
              value={form.name}
              required
              onChange={onChangeFunc}
              placeholder="Enter your name"
              className="w-full my-2 border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
            />
            <input
              type="text"
              name="bookingTitle"
              value={form.bookingTitle}
              required
              onChange={onChangeFunc}
              placeholder="Enter why you are booking this room"
              className="w-full my-2 border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
            />
          </div>

          {/* Date */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Date
            </label>

            <input
              type="date"
              name="date"
              value={form.date}
              onChange={async (e) => {
                onChangeFunc(e);
                //console.log("Calling slots");
              }}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
            />
          </div>

          {/* Slot */}
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Slot
            </label>

            <select
              value={form.slot}
              disabled={slotLoad}
              name="slot"
              onChange={onChangeFunc}
              required
              className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
            >
              {slotLoad ? (
                <>
                  <option
                    disabled
                    className="flex gap-2 items-center justify-center text-black"
                  >
                    Finding available slots... <ButtonLoader />
                  </option>
                </>
              ) : (
                allSlots.map((slot, idx) => {
                  return (
                    <option key={idx} value={slot?.value}>
                      {slot?.display}
                    </option>
                  );
                })
              )}
            </select>
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="reset"
              onClick={() => setOpenBookModal(false)}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 text-black"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
            >
              {btnLoading ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Booking... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Book Room"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
