import CryptoJS from 'crypto-js';

export function encryptData(data: any, secretKey: string) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
}

export function decryptData(ciphertext: string | CryptoJS.lib.CipherParams, secretKey: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
