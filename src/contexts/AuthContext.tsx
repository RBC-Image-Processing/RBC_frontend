import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType, Err } from '../types/index';
import { deleteToken, setToken } from '../api/token';
import { AXIOS_POST } from '../api/axios';
import toast from 'react-hot-toast';
import {
  POST_LOGIN,
  RESET_PASSWORD,
  SEND_RESET_PASSWORD_EMAIL,
} from '../helper/Urls';

// Define error response type
interface ApiError {
  response?: {
    data?: {
      message?: string;
      status?: number;
    };
  };
  message?: string;
}

function isApiError(error: unknown): error is ApiError {
  return (
    typeof error === 'object' &&
    error !== null &&
    'response' in error &&
    typeof (error as ApiError).response === 'object'
  );
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Err>({
    email: '',
    password: '',
  });

  const validate = (email: string, password: string) => {
    const newErrors = { email: '', password: '' };
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return !newErrors.email && !newErrors.password;
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    console.log(email, password, 'the mail and pass');

    if (!validate(email, password)) {
      return false;
    }
    setLoading(true);

    try {
      const res = await AXIOS_POST(POST_LOGIN, {
        email,
        password,
      });

      const { message } = res.data;

      if (res.data.status === 404) {
        toast.error(message);
        setMessage(message);
        setLoading(false);
        setTimeout(() => {
          setMessage('');
        }, 3000);
        return false;
      }

      if (res.data.status === 200) {
        if (res.data.data.token) {
          const { token, roleName } = res.data.data;
          setToken('token', token);
          setLoading(false);
          toast.success(message);

          setUser({
            token,
            email,
            role: roleName,
          });

          return true;
        }
      }

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      console.error(err);

      const errorMessage = isApiError(err)
        ? err.response?.data?.message || 'Login failed'
        : 'Login failed';
      toast.error(errorMessage);
      setMessage(errorMessage);
    }

    return false;
  };

  const sendResetPasswordRequest = async (email: string): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await AXIOS_POST(SEND_RESET_PASSWORD_EMAIL, { email });

      if (res.data.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        return true;
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error(err);

      const errorMessage = isApiError(err)
        ? err.response?.data?.message || 'Update failed'
        : 'Update failed';
      toast.error(errorMessage);
      setMessage(errorMessage);
    }

    return false;
  };

  const resetPassword = async (
    newPassword: string,
    token: string | null
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await AXIOS_POST(`${RESET_PASSWORD}/?token=${token}`, {
        newPassword,
      });

      if (res.data.status === 200) {
        setLoading(false);
        toast.success(res.data.message);
        return true;
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error(err);

      const errorMessage = isApiError(err)
        ? err.response?.data?.message || 'Update failed'
        : 'Update failed';
      toast.error(errorMessage);
      setMessage(errorMessage);
    }
    return false;
  };
  const logout = () => {
    console.log('called');
    deleteToken('token');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        loading,
        sendResetPasswordRequest,
        resetPassword,
        message,
        errors,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
