export const getToken = (key) => {
  try {
    return JSON.parse(localStorage.getItem(key));
  } catch (err) {
    console.log(`${err.message}. failed to get token `);
  }
};

export const setToken = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.log(`${err.message} failed to set token `);
  }
};

export const deleteToken = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.log(`${err.message} an error occurred on deleteToken`);
  }
};
