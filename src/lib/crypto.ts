import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_SECRET_KEY || '';

export function encryptData(data: any) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  return ciphertext;
}

export function decryptData(ciphertext: string | CryptoJS.lib.CipherParams) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, secretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
