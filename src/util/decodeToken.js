import { jwtDecode } from 'jwt-decode';
export const decodeToken = (token) => {
  const decodedToken = jwtDecode(token);
  return decodedToken;
};
