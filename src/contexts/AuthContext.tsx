import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, AuthContextType, Err } from '../types/index';
import { setToken } from '../api/token';
import { AXIOS_POST } from '../api/axios';
import toast from "react-hot-toast";
import { POST_LOGIN } from '../helper/Urls';

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




 const validate = (email:string, password:string) => {
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


  const login =  async(email: string, password: string): Promise<boolean> => {


      if(!validate(email,password)){
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
          const { token, roleName, userId } = res.data.data;
          setToken('token', token);
          setToken('role', roleName);
          setToken('userId', userId);

          setLoading(false);
          toast.success(message);

       

          setUser( {
              token,
              email,
              role: roleName
            });

   
          return true;
        }
      }

      setLoading(false);
    } catch (err: any) {
      setLoading(false);
      console.error(err);
      toast.error(err.response?.data?.message || 'Login failed');
      setMessage(err.response?.data?.message || 'Login failed');
    }

    return false;
  };

  const logout = () => setUser(null);

  return (
    <AuthContext.Provider value={{ user, login, logout , loading, message,errors}}>
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