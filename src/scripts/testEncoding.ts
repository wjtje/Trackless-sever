// Copyright (c) 2020 Wouter van der Wal

/**
 * Encodes a value to base64.
 * This makes it safe to put into a database
 */
export function encodeText (inputValue: string) : string {
  const buff = Buffer.from(inputValue, 'utf-8')
  return buff.toString('base64')
}

/**
 * Decodes base64 to a string.
 * This makes it valid to return to a user
 */
export function decodeText (inputValue: string) : string {
  const buff = Buffer.from(inputValue, 'base64')
  return buff.toString('utf-8')
}

/**
 * Decodes a json array with a encodedKey
 */
export function decodeJSON (result: any[], encodedKey: string) : any[] {
  return result.map((r) => {
    // Decode the encoded value
    r[encodedKey] = decodeText(r[encodedKey])
    return r
  })
}
