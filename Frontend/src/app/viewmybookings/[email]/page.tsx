"use client";
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
  status: "over" | "active" | "cancel";
  refundable: boolean;
};
import { useAllContexts } from "@/app/contexts/AllContexts";
import BookingCard from "../../components/BookingCard";
import { baseURL } from "../../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../../utils/emitter";
import { useEffect, useMemo, useState } from "react";
import Loader from "@/app/Loader/Loader";
import { dateConvertor } from "../../../../utils/DateConvertor";

export default function MyBookings() {
  const {
    allBookings,
    userEmail,
    pageLoading,
    setPageLoading,
    setAllBookings,
  } = useAllContexts();
  const getAllBookings = async () => {
    try {
      setPageLoading(true);
      let response = await fetch(
        `${baseURL}/booking/api/getallbookings/${userEmail}`,
      );
      let bookingData = await response.json();
      //console.log(bookingData);
      if (bookingData.success) {
        // successEmitter(bookingData.message);
        setAllBookings(bookingData.bookings);
      } else {
        errorEmitter(bookingData.message);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setPageLoading(false);
    }
  };
  const [keyWord, setKeyWord] = useState<string>("");
  const [showBookings, setShowBookings] = useState<Booking[]>(allBookings);
  const filteredBookings = useMemo(() => {
    if (keyWord == "") return allBookings;
    let filtered = allBookings.filter((booking) => {
      if (
        booking.roomId.title.toLowerCase().includes(keyWord.toLowerCase()) ||
        booking.roomId.description.toLowerCase().includes(keyWord.toLowerCase())
      ) {
        return booking;
      }
    });
    return filtered;
  }, [keyWord]);
  let finishBooking = async (bookingId: string) => {
    try {
      let response = await fetch(
        `${baseURL}/booking/api/bookingover/${bookingId}`,
        {
          method: "PATCH",
        },
      );
      let overData = await response.json();
      //console.log(overData);
      if (overData.success) {
        successEmitter(overData.message);
        setAllBookings(
          allBookings.map((booking: Booking) => {
            if (booking._id == bookingId) {
              booking.status = "over";
            }
            return booking;
          }),
        );
      } else errorEmitter(overData.message);
    } catch (error) {
      console.log(error);
    }
  };
  const checkStatus = async () => {
    await Promise.all(
      allBookings.map(async (booking: Booking) => {
        if (booking.status == "active") {
          let expired = dateConvertor(booking.date, booking.slot);
          console.log(
            `Booking for ${booking.roomId.title} is expired ? : ${expired}`,
          );
          if (expired) {
            await finishBooking(booking._id);
          }
        }
      }),
    );
  };
  useEffect(() => {
    const fetchStatus = async () => {
      await checkStatus();
    };
    fetchStatus();
  }, [new Date().getMinutes()]);
  useEffect(() => {
    const fetchBookings = async () => {
      await getAllBookings();
    };
    if (allBookings.length == 0) {
      fetchBookings();
    }
  }, []);
  useEffect(() => {
    setShowBookings(allBookings);
  }, [allBookings]);
  useEffect(() => {
    setShowBookings(filteredBookings);
  }, [keyWord]);
  useEffect(() => {
    allBookings.sort((a, b) => a.bookedAt - b.bookedAt);
  }, [allBookings]);
  return (
    <>
      {pageLoading ? (
        <Loader />
      ) : (
        <div className="min-h-screen bg-gray-100">
          <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Heading */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-black">My Bookings</h1>

              <p className="text-gray-600 mt-2">
                View all your booked meeting rooms.
              </p>
            </div>

            {/* Search */}
            <div className="bg-white border rounded-lg p-4 mb-8">
              <input
                type="text"
                value={keyWord}
                onChange={(e) => {
                  setKeyWord(e.target.value);
                }}
                placeholder="Search bookings..."
                className="w-full border border-gray-300 rounded-md px-4 py-2 outline-none focus:border-blue-500 text-black"
              />
            </div>

            {/* Booking Cards */}
            <div className="space-y-4">
              {showBookings.length > 0 ? (
                showBookings.map((booking) => (
                  <BookingCard
                    key={booking._id}
                    bookingId={booking._id}
                    bookedAt={booking.bookedAt}
                    title={booking.roomId.title}
                    image={booking.roomId.image}
                    date={booking.date}
                    slot={booking.slot}
                    id={booking.roomId._id}
                    refundable={booking.refundable}
                    status={booking.status}
                  />
                ))
              ) : (
                <div className="bg-white border rounded-lg p-10 text-center">
                  <h2 className="text-xl font-semibold text-black">
                    No Bookings Found
                  </h2>

                  <p className="text-gray-600 mt-2">
                    You haven't booked any meeting rooms yet.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
