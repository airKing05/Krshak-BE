export const stringToLowerCase = (string: string) => {
   return string.trim().toLowerCase();
}

export const doRegex = (string: string) =>  new RegExp(`^${string}$`, 'i'); // for exact match, Case-insensitive