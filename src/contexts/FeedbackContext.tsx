import React, { createContext, useContext, useState, useCallback } from 'react';
import { FeedBackContextType, Feedback, Err } from '../types/index';
import { AXIOS_DELETE, AXIOS_GET, AXIOS_POST, AXIOS_PUT } from '../api/axios';
import { DELETE_FEEDBACK, GET_FEEDBACK_BY_STUDY, POST_FEEDBACK, PUT_FEEDBACK } from '../helper/Urls';

// Initializing the feedback context with a default value
const FeedbackContext = createContext<FeedBackContextType | undefined>(undefined);

// Feedback Provider
export const FeedbackProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [feedback, setFeedback] = useState<Feedback[] | null>(null);
  const [isLoading, setLoading] = useState<boolean | null>(false);
  const [message, setMessage] = useState<string>('');
  const [errors, setErrors] = useState<Err | null>(null);

  const getFeedback = useCallback(async (doctor_comment_id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await AXIOS_GET(`${GET_FEEDBACK_BY_STUDY}/${doctor_comment_id}`); // Adjust API endpoint as needed
      if(response.data.status === 200) {
    const data = response.data.data
      setFeedback(data);
      setLoading(false);
      }
      
    
      return true;
    } catch (error) {
      setErrors(error as Err);
      setLoading(false);
      return false;
    }finally {
      setLoading(false);
    }
  }, []);

  const postFeedback = async (data: object): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await AXIOS_POST(`${POST_FEEDBACK}`,data)

      if(response.data.status === 200){
     const newFeedback = await response.data.data;
      setFeedback((prev) => (prev ? [...prev, newFeedback] : [newFeedback]));
      setLoading(false);
    }
    return true;
      
 
    } catch (error) {
      setErrors(error as Err);
      setLoading(false);
      return false;
    }finally {
      setLoading(false);
    }
  };

  const putFeedback = async (doctor_comment_id: string, data: object): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await AXIOS_PUT(`${PUT_FEEDBACK}/${doctor_comment_id}`, data);
    
      const updatedFeedback = await response.data.data;
      setFeedback((prev) =>
        prev ? prev.map((fb) => (fb.doctor_comment_id === doctor_comment_id ? updatedFeedback : fb)) : []
      );
      setLoading(false);
      return true;
    } catch (error) {
      setErrors(error as Err);
      setLoading(false);
      return false;
    }finally {
      setLoading(false);
    }
  };

  const deleteFeedback = async (doctor_comment_id: string): Promise<boolean> => {
    setLoading(true);
    try {
      const response = await AXIOS_DELETE(`${DELETE_FEEDBACK}/${doctor_comment_id}`)
      
        if (response.data.status === 404) {
            setMessage(response.data.message);
            setLoading(false);
            return false;
        }
      
      setFeedback((prev) => (prev ? prev.filter((fb) => fb.doctor_comment_id !== doctor_comment_id) : []));
      setLoading(false);
      return true;
    } catch (error) {
      setErrors(error as Err);
      setLoading(false);
      return false;
    }finally {
      setLoading(false);
    }
  };

  return (
    <FeedbackContext.Provider
      value={{
        feedback,
        getFeedback,
        postFeedback,
        putFeedback,
        deleteFeedback,
        isLoading,
        message,
        errors,
      }}
    >
      {children}
    </FeedbackContext.Provider>
  );
};

// Custom hook to use the Feedback context
export const useFeedBack = (): FeedBackContextType => {
  const context = useContext(FeedbackContext);
  if (context === undefined) {
    throw new Error('useFeedBack must be used within a FeedbackProvider');
  }
  return context;
};
