import React, { createContext, useState, useContext, ReactNode } from 'react';
import {  UserContextType , UserErr, UserList} from '../types/index';
import { AXIOS_GET, AXIOS_POST, AXIOS_PUT } from '../api/axios';
import toast from "react-hot-toast";
import { ACTIVATE_ACCOUNT, GET_USERS, REGISTER_USER, SEND_ACTIVATION_EMAIL, UPDATE_USER , } from '../helper/Urls';


const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
   const [users, setUsers] = useState<UserList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<UserErr>({
    fullName: '',
    email: '',
    roleId:''
  });




  const registerUser =  async(fullName: string, roleId: string , email:string): Promise<boolean> => {

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
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.error(err.response?.data?.message );
      setMessage(err.response?.data?.message );
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
      toast.success(res.data.message);   
      return true;
    }
  } catch (err: any) {
    setLoading(false);
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Login failed';
    toast.error(errorMessage);
    setMessage(errorMessage);
  }
  return false;
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
  } catch (err: any) {
    setLoading(false);
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Update failed';
    toast.error(errorMessage);
    setMessage(errorMessage);
  }
  return false;
}

const sendActivateAccountRequest = async (email: string): Promise<boolean> => {
  setLoading(true);
  try {
    const res = await AXIOS_POST(SEND_ACTIVATION_EMAIL, { email });

    if (res.data.status === 200) {
      setLoading(false);
      toast.success(res.data.message);
      return true;
    }
  } catch (err: any) {
    setLoading(false);
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Update failed';
    toast.error(errorMessage);
    setMessage(errorMessage);
  }

  return false;

}


const activateAccount = async (newPassword: string): Promise<boolean> => {
  setLoading(true);
  try {
    const res = await AXIOS_PUT(ACTIVATE_ACCOUNT, { newPassword });

    if (res.data.status === 200) {
      setLoading(false);
      toast.success(res.data.message);
      return true;
    }
  } catch (err: any) {
    setLoading(false);
    console.error(err);
    const errorMessage = err.response?.data?.message || 'Update failed';
    toast.error(errorMessage);
    setMessage(errorMessage);
  }
  return false;

}




  return (
    <UserContext.Provider value={{  users, registerUser , updateUser,  sendActivateAccountRequest, activateAccount, loading, message,errors, getUsers}}>
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