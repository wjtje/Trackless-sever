/**
 * Checks if there are no bad keys in the first array using the second array
 * 
 * @since 0.2-beta.1
 * @param array 
 * @param searchList 
 */
export function arrayContainOnly(array: Array<string>, searchList: Array<string>) {
  return new Promise((resolve, reject) => {
    let isRejected = false;

    array.forEach(item => {
      if (!searchList.includes(item)) {
        isRejected = true;
        reject();
      }
    });
    
    if (!isRejected) {
      resolve();
    }
  });
}
