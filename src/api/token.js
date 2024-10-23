export const getToken = (key) => {
  try {
    return JSON.parse(sessionStorage.getItem(key));
  } catch (err) {
    console.log(`${err.message}. Failed to get token`);
  }
};

export const setToken = (key, value) => {
  try {
    sessionStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(`${err.message} Failed to set token`);
  }
};

export const deleteToken = (key) => {
  try {
    sessionStorage.removeItem(key);
  } catch (err) {
    console.log(`${err.message} An error occurred on deleteToken`);
  }
};
