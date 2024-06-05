"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use(express_1.default.json());
const express_rate_limit_1 = require("express-rate-limit");
const SECRET_KEY = "0x4AAAAAAAb-f-qqE4_6O63Imw2iIMhtLcU";
const cors_1 = __importDefault(require("cors"));
app.use((0, cors_1.default)());
// Record<K,T> => K is the key value of this record type which is unique and T would be the value stored for that key value of type string
const otpStore = {};
const limiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 5 * 60 * 1000, // 5 minutes
    max: 3, // Limit each IP to 3 OTP requests per windowMs
    message: 'Too many requests, please try again after 5 minutes',
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
//!this will use for all the requests in the server
// app.use(limiter);
app.post("/generate-otp", limiter, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
}));
// app.post("/reset-password", async (req, res) => { 
//     const { email, otp, newPassword } = req.body;
//     if (!email || !otp || !newPassword) {
//         return res.status(400).json({ message: "Email, OTP, and new password are required" });
//     }
//     if (otpStore[email] === otp) {
//         console.log(`Password for ${email} has been reset to: ${newPassword}`);
//         delete otpStore[email]; // Clear the OTP after use
//         res.status(200).json({ message: "Password has been reset successfully" });
//     } else {
//         res.status(401).json({ message: "Invalid OTP" });
//     }
// });
// Endpoint to reset password
app.post('/reset-password', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, otp, newPassword, token } = req.body;
    console.log(token);
    let formData = new FormData();
    formData.append('secret', SECRET_KEY);
    formData.append('response', token);
    const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    const result = yield fetch(url, {
        body: formData,
        method: 'POST',
    });
    const challengeSucceeded = (yield result.json()).success;
    if (!challengeSucceeded) {
        return res.status(403).json({ message: "Invalid reCAPTCHA token" });
    }
    if (!email || !otp || !newPassword) {
        return res.status(400).json({ message: "Email, OTP, and new password are required" });
    }
    if (Number(otpStore[email]) === Number(otp)) {
        console.log(`Password for ${email} has been reset to: ${newPassword}`);
        delete otpStore[email]; // Clear the OTP after use
        res.status(200).json({ message: "Password has been reset successfully" });
    }
    else {
        res.status(401).json({ message: "Invalid OTP" });
    }
}));
app.listen(PORT, () => {
    console.log(`Server is running on PORT ${PORT}`);
});
