const otpGenerator = require('otp-generator');
exports.generateOTP = () => {
    return otpGenerator.generate(6, {lowerCaseAlphabets: false, upperCaseAlphabets: false, specialChars: false});
}