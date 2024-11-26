export const getToken = (key: string) => {
  try {
    return JSON.parse(sessionStorage.getItem(key) as string);
  } catch (err) {
    console.log(`${err}. Failed to get token`);
  }
};

export const setToken = (key: string, value: string) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(`${err} Failed to set token`);
  }
};

export const deleteToken = (key: string) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.log(`${err} An error occurred on deleteToken`);
  }
};
