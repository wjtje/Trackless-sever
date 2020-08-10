/**
 * @since 0.2-beta.1
 * @param {string} salt A random string
 * @param {string} hash The hash of your password + the salt
 */
export interface hashedPassword {
  salt: string;
  hash: string;
}