import express from "express";
const app = express();
const PORT = 3000;
app.use(express.json());
import {rateLimit} from "express-rate-limit";


// Record<K,T> => K is the key value of this record type which is unique and T would be the value stored for that key value of type string
const otpStore: Record<string, string> = {};


const limiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
})

//!this will use for all the requests in the server
// app.use(limiter);

app.post("/generate-otp", limiter , async (req, res) => {
    const email = req.body.email;
    if (!email) {
        return res.status(400).json({
            msg: "Email ID is missing"
        });
    }
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // generates a 6-digit OTP
    otpStore[email] = otp;
    console.log(`OTP for ${email} is ${otp}`);
    res.status(200).json({ message: "OTP generated and logged" });
});

app.post("/reset-password", async (req, res) => { 
    const { email, otp, newPassword } = req.body;
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (otpStore[email] === otp) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email]; // Clear the OTP after use
        res.status(200).json({ message: "Password has been reset successfully" });
    } else {
        res.status(401).json({ message: "Invalid OTP" });
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
