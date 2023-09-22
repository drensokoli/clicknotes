import CryptoJS from 'crypto-js';

const secretKey = process.env.NEXT_PUBLIC_CRYPTO_KEY || '';

export function encryptData(data: any, ssrSecretKey: string) {
  const ciphertext = CryptoJS.AES.encrypt(JSON.stringify(data), ssrSecretKey).toString();
  return ciphertext;
}

export function decryptData(ciphertext: string | CryptoJS.lib.CipherParams, ssrSecretKey: string) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, ssrSecretKey);
  const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
  return decryptedData;
}
