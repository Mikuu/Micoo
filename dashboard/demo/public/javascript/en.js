document.getElementById("submitForm").onsubmit = function(event) {
    const passcode = document.getElementById("passcode").value;
    document.getElementById("passcode").value = CryptoJS.AES.encrypt(passcode, passcode);
};
