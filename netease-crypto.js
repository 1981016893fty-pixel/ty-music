// 网易云音乐API加密模块
// 从 NeteaseCloudMusicApi 项目改编

const crypto = require('crypto');

const modulus = '00e0b509f6259df8642dbc35662901477df22677ec152b5ff68ace615bb7b725152b3ab17a876aea8a5aa76d2e417629ec4ee341f56135fccf695280104e0312ecbda92557c93870114af6c9d05c4f7f0c3685b7a46bee255932575cce10b424d813cfe4875d3e82047b97ddef52741d546b8e289dc6935b3ece0462db0a22b8e7';
const nonce = '0CoJUm6Qyw8W8jud';
const pubKey = '010001';

function createSecretKey(size) {
  const keys = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < size; i++) {
    key += keys.charAt(Math.floor(Math.random() * keys.length));
  }
  return key;
}

function aesEncrypt(text, key) {
  const cipher = crypto.createCipheriv('aes-128-cbc', key, '0102030405060708');
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

function rsaEncrypt(text, pubKey, modulus) {
  text = Buffer.from(text).reverse().toString('hex');
  const biText = BigInt('0x' + text);
  const biExponent = BigInt('0x' + pubKey);
  const biModulus = BigInt('0x' + modulus);
  const biEncrypted = biText ** biExponent % biModulus;
  return biEncrypted.toString(16).padStart(256, '0');
}

function encrypt(data) {
  const text = JSON.stringify(data);
  const secretKey = createSecretKey(16);
  
  const encText = aesEncrypt(aesEncrypt(text, nonce), secretKey);
  const encSecKey = rsaEncrypt(secretKey, pubKey, modulus);
  
  return {
    params: encText,
    encSecKey: encSecKey
  };
}

module.exports = { encrypt };
