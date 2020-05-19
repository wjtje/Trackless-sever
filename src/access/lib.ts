/**
 * Rules for access
 * group_id 0 (default) No access
 * group_id 1 (admin) All access
 */

export function checkAccess(group_id: number, method: "get" | "post" | "delete" | "patch", url: string) : Promise<string> {
  return new Promise((resolve, reject) => {
    if (group_id === 0) {
      reject('group_id 0 does not have any access.');
    } else if (group_id === 1) {
      resolve();
    } else {
      // Scan in the database
    }
  });
}