import CryptoJS from "crypto-js";

export function encryptPassword(password) {
    return CryptoJS.AES.encrypt(JSON.stringify(password), 'kcGSJ548tq3bsLKFfwuefhfj9n').toString();
}

export function decryptPassword(ciphertext){
    let bytes = CryptoJS.AES.decrypt(ciphertext, 'kcGSJ548tq3bsLKFfwuefhfj9n');
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8)); 
}


export function customSort(list , key){
    return list.sort(function (first, second) {
        if (first.key > second.key) {
           return -1;
        }
        if (first.key < second.key) {
           return 1;
        }
        return 0;
     });
}