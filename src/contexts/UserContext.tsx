import React, { createContext, useState, useContext, ReactNode } from 'react';
import { LoggedUser, UserContextType, UserErr, UserList } from '../types/index';
import { AXIOS_GET, AXIOS_POST, AXIOS_PUT } from '../api/axios';
import toast from 'react-hot-toast';
import {
  ACTIVATE_ACCOUNT,
  GET_USERS,
  REGISTER_USER,
  SEND_ACTIVATION_EMAIL,
  UPDATE_USER,
} from '../helper/Urls';
import { UserDetails } from '../types/index';

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

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [users, setUsers] = useState<UserList[]>([]);
  const [loggedInUser, setLoggedInUser] = useState<LoggedUser | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors] = useState<UserErr>({
    fullName: '',
    email: '',
    roleId: '',
  });

  const registerUser = async (
    fullName: string,
    roleId: string,
    email: string
  ): Promise<boolean> => {
    setLoading(true);

    try {
      const res = await AXIOS_POST(REGISTER_USER, {
        fullName,
        email,
        roleId,
        isActive: false,
        Verified: false,
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

      if (res.data.status === 200 || res.data.status === 201) {
        toast.success(message);

        if (res.data.data) {
          setLoading(false);
          return true;
        }
      }

      setLoading(false);
    } catch (err: unknown) {
      setLoading(false);
      console.error(err);

      const errorMessage = isApiError(err)
        ? err.response?.data?.message || 'Registration failed'
        : 'Registration failed';
      toast.error(errorMessage);
      setMessage(errorMessage);
    }

    return false;
  };

  const getUsers = async (): Promise<boolean> => {
    setLoading(true);

    try {
      // Assume AXIOS_GET is properly typed or you can add its type like this:
      const res = await AXIOS_GET(GET_USERS);

      if (res.data.status === 200) {
        setUsers(res.data.data);
        setLoading(false);

        // toast.success(res.data.message);
        return true;
      }
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

  const getUser = async (userId: string): Promise<boolean> => {
    setLoading(true);

    try {
      // Assume AXIOS_GET is properly typed or you can add its type like this:
      const res = await AXIOS_GET(`${GET_USERS}${userId}`);

      if (res.data.status === 200) {
        setLoggedInUser(res.data.data);
        setLoading(false);
        // toast.success(res.data.message);
        return true;
      }
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

  const getUserDetails = async (
    userId: string
  ): Promise<UserDetails | null> => {
    setLoading(true);

    try {
      // Assume AXIOS_GET is properly typed or you can add its type like this:
      const res = await AXIOS_GET(`${GET_USERS}${userId}`);

      if (res.data.status === 200) {
        setLoading(false);
        return res.data.data;
      }
    } catch (err: unknown) {
      setLoading(false);
      console.error(err);

      const errorMessage = isApiError(err)
        ? err.response?.data?.message || 'Login failed'
        : 'Login failed';
      toast.error(errorMessage);
      setMessage(errorMessage);
    }
    return null;
  };

  const updateUser = async (userId: string, data: object): Promise<boolean> => {
    setLoading(true);

    try {
      const res = await AXIOS_PUT(`${UPDATE_USER}${userId}`, data);

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

  const sendActivateAccountRequest = async (
    email: string
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await AXIOS_POST(SEND_ACTIVATION_EMAIL, { email });

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

  const activateAccount = async (
    newPassword: string,
    token: string | null
  ): Promise<boolean> => {
    setLoading(true);
    try {
      const res = await AXIOS_POST(`${ACTIVATE_ACCOUNT}/?token=${token}`, {
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

  return (
    <UserContext.Provider
      value={{
        users,
        loggedInUser,
        getUser,
        registerUser,
        updateUser,
        sendActivateAccountRequest,
        activateAccount,
        loading,
        message,
        errors,
        getUsers,
        getUserDetails,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within an UserProvider');
  }
  return context;
};
