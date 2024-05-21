
function otp() {
   let  otp = Math.floor(Math.random() * (999999 - 111111 + 1)) + 111111;
    return otp
}

module.exports = otp

