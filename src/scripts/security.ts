import { sha512_256 } from "js-sha512";
import { hashedPassword } from "./interfaces";

/**
 * Generates a random string using Math.random()
 * 
 * @since 0.2-beta.1
 * @param {number} length Length of the string
 * @returns {string} An random string
 */
export function generateRandomString(length:number) : string {
  let result = '';
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const charLength = chars.length;

  for (var i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * charLength));
  }

  return result;
}

/**
 * A way to secure a password
 * 
 * @since 0.2-beta.1
 * @param {string} password 
 * @returns {hashedPassword} An object with a salt and a hash
 */
export function storePassword(password: string) : hashedPassword {
  const salt = generateRandomString(32);
  const hash = sha512_256(password + salt);

  return {
    salt: salt,
    hash: hash
  }
}