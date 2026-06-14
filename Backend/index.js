const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const cors = require("cors");
const roomRouter = require("./Router/room.router");
const bookingRouter = require("./Router/booking.router");
const connectToDB = require("./connectToDB");
const app = express();
app.use(express.json());
const PORT = process.env.PORT || 5000;
app.use(cors({
    origin: [`https://roomit-alpha.vercel.app`],
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE"],
}));
connectToDB();
app.use("/room/api", roomRouter);
app.use("/booking/api", bookingRouter);
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});