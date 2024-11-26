import { jwtDecode } from 'jwt-decode';
import { CustomJwtPayload } from '../types/index';

export const decodeToken = (token: string): CustomJwtPayload => {
  const decodedToken = jwtDecode<CustomJwtPayload>(token);
  return decodedToken;
};
