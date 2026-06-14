"use client";
type Props = {
  bookingId: string;
  id: string;
  title: string;
  image: string;
  date: string;
  slot: string;
  bookedAt: number;
  refundable: boolean;
  status: "over" | "active" | "cancel";
};

import { CalendarDays, Clock3 } from "lucide-react";
import { timeCalc } from "../../../utils/TimeCalculator";
import Link from "next/link";
import { getRealDate } from "../../../utils/DateParser";
import { timeTeller } from "../../../utils/TimeTeller";
import { useAllContexts } from "../contexts/AllContexts";
import { baseURL } from "../../../utils/baseURL";
import { errorEmitter, successEmitter } from "../../../utils/emitter";
import { useEffect, useState } from "react";
import ButtonLoader from "../Loader/ButtonLoader";
import { bookingCancellor } from "../../../utils/RefundChecker";

export default function BookingCard({
  bookingId,
  title,
  image,
  date,
  slot,
  bookedAt,
  id,
  status,
  refundable,
}: Props) {
  const { btnLoading, setBtnLoading, allBookings, setAllBookings } =
    useAllContexts();
  const [deleteBtn, setDeleteBtn] = useState<boolean>(false);
  const [fade, setFade] = useState<boolean>(false);
  const [refundableState, setRefundableState] = useState<boolean>(refundable);
  const cancelBooking = async () => {
    try {
      setBtnLoading(true);
      let response = await fetch(
        `${baseURL}/booking/api/cancelbooking/${bookingId}`,
        {
          method: "PATCH",
        },
      );
      let cancelData = await response.json();
      // console.log(cancelData);
      if (cancelData.success) {
        successEmitter(cancelData.message);
        setAllBookings(
          allBookings.map((booking) => {
            if (booking._id == bookingId) {
              booking.status = "cancel";
              booking.refundable = cancelData.booking.refundable;
            }
            return booking;
          }),
        );
      } else errorEmitter(cancelData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setBtnLoading(false);
    }
  };
  const deleteBooking = async () => {
    try {
      setDeleteBtn(true);
      let response = await fetch(
        `${baseURL}/booking/api/deletebooking/${bookingId}`,
        {
          method: "DELETE",
        },
      );
      let deleteData = await response.json();
      // console.log(deleteData);
      if (deleteData.success) {
        //successEmitter(deleteData.message);
        setAllBookings(
          allBookings.filter((booking) => booking._id != bookingId),
        );
      } else errorEmitter(deleteData.message);
    } catch (error) {
      console.log(error);
    } finally {
      setDeleteBtn(false);
    }
  };
  // useEffect(() => {
  //   let check = bookingCancellor(date, slot);
  //   if (check) {
  //     setRefundableState(true);
  //   } else {
  //     setRefundableState(false);
  //   }
  // }, [new Date().getMinutes()]);
  return (
    <div
      style={{
        animation: fade ? `fadeBooking 0.5s linear forwards` : `none`,
      }}
      className="bg-white border rounded-lg shadow-sm p-4 hover:shadow-md transition"
    >
      <div className="flex gap-4">
        {/* Room Image */}
        <Link href={`/viewroom/${id}`}>
          <img
            src={image}
            alt={title}
            className="w-20 h-20 rounded-md object-cover"
          />
        </Link>

        {/* Main Content */}
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <h2 className="text-lg font-semibold text-black">{title}</h2>

            <span
              className={
                status == "active"
                  ? `bg-green-100 text-green-700 text-xs px-3 py-1 rounded-full`
                  : status == "over"
                    ? `bg-blue-100 text-blue-700 text-xs px-3 py-1 rounded-full`
                    : `bg-red-100 text-red-700 text-xs px-3 py-1 rounded-full`
              }
            >
              {status == "active"
                ? "Booked"
                : status == "over"
                  ? "Over"
                  : "Cancelled"}
            </span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-2">
            <CalendarDays size={16} />
            <span>{getRealDate(date)}</span>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-600 mt-1">
            <Clock3 size={16} />
            {/* <span>{slot}</span> */}
            <span>{timeTeller(slot)}</span>
          </div>

          {/* Booking Timestamp */}
          <p className="text-xs text-gray-500 mt-2">
            Booked {timeCalc(bookedAt)}
          </p>
          {/* Refund Indicator */}
          <div className="mt-2">
            <span
              className={`text-xs px-3 py-1 rounded-full ${
                status == "active"
                  ? refundable
                    ? "bg-green-100 text-green-700"
                    : "bg-yellow-100 text-yellow-700"
                  : status == "cancel"
                    ? refundable
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                    : "bg-gray-100 text-gray-700"
              }`}
            >
              <span className={refundable ? `text-green-700` : `text-red-700`}>
                {status == "active"
                  ? refundable
                    ? "Cancellation Available"
                    : "Cancellation Unavailable"
                  : status == "cancel"
                    ? refundable
                      ? "Cancelled (Refundable)"
                      : "Cancelled (Non-Refundable)"
                    : "Booking Completed"}
              </span>
            </span>
          </div>
          {/* Action Buttons */}
          <div className="flex gap-2 mt-3">
            {/* Cancel Button */}
            {status == "active" && (
              <button
                disabled={deleteBtn || btnLoading}
                className="px-4 py-2 bg-red-500 text-white text-sm rounded-md hover:bg-red-600 transition"
                onClick={async () => {
                  await cancelBooking();
                }}
              >
                {btnLoading ? (
                  <div className="flex gap-2 items-center justify-center">
                    Cancelling... <ButtonLoader />
                  </div>
                ) : (
                  "Cancel Booking"
                )}
              </button>
            )}
            {/* Delete Button */}
            <button
              disabled={deleteBtn || btnLoading}
              onClick={async () => {
                if (status == "active") {
                  errorEmitter(
                    "Active bookings cannot be deleted, cancel them first",
                  );
                  return;
                }
                setFade(true);
                await deleteBooking();
              }}
              className="px-4 py-2 bg-gray-700 text-white text-sm rounded-md hover:bg-gray-800 transition"
            >
              {deleteBtn ? (
                <>
                  <div className="flex gap-2 items-center justify-center">
                    Deleting... <ButtonLoader />
                  </div>
                </>
              ) : (
                "Delete Booking"
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
