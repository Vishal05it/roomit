const express = require("express");
const roomModel = require("../Schema/room.model");
const bookingModel = require("../Schema/booking.model");
const bookingRouter = express.Router();
const { getRealDate } = require("../utils/DateParser");
const { verifyDate } = require("../utils/DateChecker");
const { bookingCancellor } = require("../utils/BookingCancellor");
const limiterModel = require("../Schema/limiter.model");
const { default: mongoose } = require("mongoose");
const transport = require("../Mailer/mailer");
const { timeTeller } = require("../utils/TimeTeller");
bookingRouter.get("/getallbookings/:email", async (req, res) => {
    try {
        let allBookings = await bookingModel.find({ bookedBy: req.params.email }).populate("roomId");
        return res.status(200).json({
            message: "All bookings found",
            success: true,
            bookings: allBookings,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
bookingRouter.get("/findslots/:date/:roomId", async (req, res) => {
    try {
        let allPossibeSlots = ["12:00 - 12:30", "12:30 - 13:00", "13:00 - 13:30", "13:30 - 14:00", "14:00 - 14:30", "14:30 - 15:00", "15:00 - 15:30", "15:30 - 16:00", "16:00 - 16:30", "16:30 - 17:00", "17:00 - 17:30", "17:30 - 18:00", "18:00 - 18:30", "18:30 - 19:00", "19:00 - 19:30", "19:30 - 20:00", "20:00 - 20:30", "20:30 - 21:00", "21:00 - 21:30", "21:30 - 22:00", "22:00 - 22:30", "22:30 - 23:00", "23:00 - 23:30", "23:30 - 00:00", "00:00 - 00:30", "00:30 - 01:00", "01:00 - 01:30", "01:30 - 02:00", "02:00 - 02:30", "02:30 - 03:00", "03:00 - 03:30", "03:30 - 04:00", "04:00 - 04:30", "04:30 - 05:00", "05:00 - 05:30", "05:30 - 06:00", "06:00 - 06:30", "06:30 - 07:00", "07:00 - 07:30", "07:30 - 08:00", "08:00 - 08:30", "08:30 - 09:00", "09:00 - 09:30", "09:30 - 10:00", "10:00 - 10:30", "10:30 - 11:00", "11:00 - 11:30", "11:30 - 12:00"]
        //console.log("Date asked : ", req.params.date + " and roomId = ", req.params.roomId)
        const allBookingsThatDay = await bookingModel.find({ date: req.params.date, roomId: req.params.roomId });
        //console.log("All Bookings : ", allBookingsThatDay);
        let freeSlots = [];
        let blockedSlots = [];
        let blockIdx = 0;
        for (let booking of allBookingsThatDay) {
            blockedSlots[blockIdx] = booking.slot;
            blockIdx++;
        }
        //console.log("Blocked slots after parsing : ", blockedSlots);
        let freeIdx = 0;
        for (let slot of allPossibeSlots) {
            // console.log("A free slot : ", slot);
            if (!blockedSlots.includes(slot)) {
                freeSlots[freeIdx] = slot;
                freeIdx++;
            }
        }
        // console.log("Free slots after parsing : ", freeSlots);
        return res.status(200).json({
            message: "All possible slots found",
            success: true,
            slots: freeSlots,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
bookingRouter.post("/bookroom/:roomId", async (req, res) => {
    try {
        const { bookedBy, slot, date } = req.body;
        const possible = verifyDate(date, slot);
        if (!possible) {
            return res.status(400).json({
                message: "Booking for invalid date or slot",
                success: false,
            });
        }
        let room = await roomModel.findById(req.params.roomId);
        if (!room) {
            return res.status(404).json({
                message: "Room not found",
                success: false,
            });
        }
        if (room.cleanTime >= Date.now()) {
            return res.status(401).json({
                message: "Please wait 30 seconds, room under cleaning",
                success: false,
            });
        }
        let findDate = getRealDate(date);
        const findDoc = await limiterModel.findOne({ date: findDate, bookedBy });
        if (!findDoc) {
            const addTime = await limiterModel.create({
                date: findDate,
                hours: 0.5,
                bookedBy,
            });
        }
        else {
            if (findDoc.hours >= 4) {
                return res.status(402).json({
                    message: "You can book rooms for the duration of 4 hours per day only",
                    success: false,
                });
            }
            const increaseTime = await limiterModel.updateOne({ date: findDate, bookedBy }, { hours: findDoc.hours + 0.5 });
        }
        const newBooking = await bookingModel.create({ roomId: req.params.roomId, bookedBy, slot, date, bookedAt: Date.now() });
        const sendBooking = await bookingModel.findById(newBooking._id).populate("roomId");
        transport.sendMail({
            from: process.env.EMAIL,
            to: bookedBy,
            subject: "Your Meeting Room Booking is Confirmed",
            text: `Dear User,

Your meeting room booking has been successfully confirmed.

Here are your booking details:

• Room: ${room.title}
• Date: ${getRealDate(date)}
• Time Slot: ${timeTeller(slot)}

Please ensure that you arrive on time for your scheduled booking. If you need to cancel your reservation, you may do so through the Room IT portal. Refund eligibility, if applicable, will be determined according to the cancellation policy.

Thank you for using Room IT. We hope your meeting is productive and successful.

Best regards,

Room IT Team
Meeting Room Booking System`
        })
        return res.status(200).json({
            message: "Room booked successfully",
            success: true,
            booking: sendBooking,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        if (error.code === 11000) {
            return res.status(409).json({
                message: "Room already booked for selected date and slot",
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
bookingRouter.patch("/bookingover/:bookingId", async (req, res) => {
    try {
        let booking = await bookingModel.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or already over",
                success: false,
            });
        }
        let room = await roomModel.findByIdAndUpdate(booking.roomId, { cleanTime: Date.now() + 30000 }, { new: true });
        let overBooking = await bookingModel.findByIdAndUpdate(req.params.bookingId, { status: "over" }, { new: true });
        let findDate = getRealDate(booking.date);
        //console.log("Find date : ", findDate);
        //console.log(`Booked by : ${booking.bookedBy}`);
        let limiter = await limiterModel.findOne({ bookedBy: booking.bookedBy, date: findDate });
        // console.log("Limiter doc : ", limiter);
        if (limiter && limiter.hours - 0.5 == 0) {
            await limiterModel.findByIdAndDelete(limiter._id);
        }
        else {
            let limiterDoc = await limiterModel.findOne({ bookedBy: booking.bookedBy, date: findDate });
            let reduceLimiter = await limiterModel.updateOne({ bookedBy: booking.bookedBy, date: findDate }, { hours: limiterDoc.hours - 0.5 });
        }
        return res.status(200).json({
            message: "Booking over",
            success: true,
            booking: overBooking,
        })

    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
bookingRouter.patch("/cancelbooking/:bookingId", async (req, res) => {
    try {
        let booking = await bookingModel.findById(req.params.bookingId).populate("roomId");
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found",
                success: false,
            });
        }
        if (booking.status == "over" || booking.status == "cancel") {
            return res.status(400).json({
                message: "Booking already over or cancelled",
                success: false,
            });
        }
        let refundable = bookingCancellor(booking.date, booking.slot.toString().slice(0, 2));
        // let room = await roomModel.findByIdAndUpdate(booking.roomId);
        let cancelBooking = await bookingModel.findByIdAndUpdate(req.params.bookingId, { status: "cancel", refundable }, { new: true });
        let findDate = getRealDate(booking.date);
        let limiter = await limiterModel.findOne({ bookedBy: booking.bookedBy, date: findDate });
        if (limiter && limiter.hours - 0.5 == 0) {
            await limiterModel.findByIdAndDelete(limiter._id);
        }
        else {
            let limiterDoc = await limiterModel.findOne({ bookedBy: booking.bookedBy, date: findDate });
            let reduceLimiter = await limiterModel.updateOne({ bookedBy: booking.bookedBy, date: findDate }, { hours: limiterDoc.hours - 0.5 });
        }
        if (refundable) {
            transport.sendMail({
                from: process.env.EMAIL,
                to: booking.bookedBy,
                subject: "Your Meeting Room Booking Has Been Cancelled",
                text: `Dear User,

Your meeting room booking has been successfully cancelled.

Here are the details of your cancelled booking:

• Room: ${booking.roomId.title}
• Date: ${getRealDate(booking.date)}
• Time Slot: ${timeTeller(booking.slot)}

We would like to inform you that your cancellation qualified for a refund under our cancellation policy. The refund process has been initiated, and the amount will be credited to your original payment method within 2 business days.

If you do not receive the refund within the expected time frame, please contact our support team for assistance.

Thank you for using Room IT. We appreciate your understanding and look forward to serving you again.

Best regards,

Room IT Team
Meeting Room Booking System`
            })
            return res.status(200).json({
                message: "Booking cancelled, refund will reflect in your bank account in 2 days",
                success: true,
                booking: cancelBooking,
            });
        }
        else {
            transport.sendMail({
                from: process.env.EMAIL,
                to: booking.bookedBy,
                subject: "Your Meeting Room Booking Has Been Cancelled",
                text: `Dear User,

Your meeting room booking has been successfully cancelled.

Here are the details of your cancelled booking:

• Room: ${booking.roomId.title}
• Date: ${getRealDate(booking.date)}
• Time Slot: ${timeTeller(booking.slot)}

We regret to inform you that this cancellation does not qualify for a refund. According to our cancellation policy, bookings must be cancelled at least 2 hours before the scheduled start time to be eligible for a refund.

As your cancellation request was made within the 2-hour window prior to the booking, no refund can be processed for this reservation.

Thank you for your understanding and for using Room IT. We look forward to serving you again in the future.

Best regards,

Room IT Team
Meeting Room Booking System`
            })
            return res.status(200).json({
                message: "Booking cancelled, ineligible for refund",
                success: true,
                booking: cancelBooking,
            });
        }
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
});
bookingRouter.delete("/deletebooking/:bookingId", async (req, res) => {
    try {
        let booking = await bookingModel.findById(req.params.bookingId);
        if (!booking) {
            return res.status(404).json({
                message: "Booking not found or already deleted",
                success: false,
            });
        }
        if (booking.status == "active") {
            return res.status(401).json({
                message: "Active bookings cannot be deleted, cancel them first",
                success: false,
            });
        }
        let deletedBooking = await bookingModel.findByIdAndDelete(req.params.bookingId);
        return res.status(200).json({
            message: "Booking deleted",
            success: true,
            booking: deletedBooking,
        });
    } catch (error) {
        console.log(error);
        if (error instanceof mongoose.Error.ValidationError) {
            let messages = Object.values(error.errors).map((err) => err.message);
            return res.status(500).json({
                message: messages[0],
                success: false,
            });
        }
        return res.status(500).json({
            message: "Internal Server Error",
            success: false,
        });
    }
})
module.exports = bookingRouter;