import React, { createContext, useState, useContext, ReactNode } from "react";
import { AXIOS_DELETE, AXIOS_GET, AXIOS_POST, AXIOS_PUT } from "../api/axios";
import { INTEPRETATION } from "../helper/Urls";

// Define types for interpretation and context state
interface Interpretation {
  interpretationId: string | undefined;
  studyId: string;
  userId: string;
  diagnosis: string;
}

interface InterpretationContextType {
  retInterpretations: Interpretation[];
  isLoading: boolean;
  error: string | null;
  createInterpretation: (studyId: string | undefined, userId: string | undefined, diagnosis: string) => void;
  getInterpretationByStudyId: (studyId: string | undefined) => void;
  updateInterpretation: (interpretationId: string, diagnosis: string) => void;
  deleteInterpretation: (interpretationId: string) => void;
}

// Default context value
const defaultContextValue: InterpretationContextType = {
  retInterpretations: [],
  isLoading: false,
  error: null,
  createInterpretation: () => {},
  getInterpretationByStudyId: () => {},
  updateInterpretation: () => {},
  deleteInterpretation: () => {},
};
//ss
// Create context
const InterpretationContext = createContext<InterpretationContextType>(defaultContextValue);

// Create the provider component
export const InterpretationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [retInterpretations, setRetInterpretations] = useState<Interpretation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch interpretations by study ID
const getInterpretationByStudyId = async (studyId: string): Promise<Interpretation[]> => {

    setIsLoading(true);
    try {
      const response = await AXIOS_GET(`/api/interpretation/study/${studyId}`);
      setRetInterpretations(response.data.data); // Assuming your response has a data field with interpretations
     console.log("Retrieved interpretations", response.data.data);
      setError(null);
      return response.data.data;
    } catch (err) {
      setError("Error fetching interpretations");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
    return [];
  };

  // Create a new interpretation
  const createInterpretation = async (studyId: string | undefined, userId: string | undefined, diagnosis: string | undefined) => {
    setIsLoading(true);
    try {
      const response = await AXIOS_POST(INTEPRETATION, {
        studyId: studyId,
        userId: userId,
        diagnosis: diagnosis,
      });
      console.log(response.data.data);
      setRetInterpretations((prev) => [...prev, response.data.data]); // Add the new interpretation to the state
      setError(null);
    } catch (err) {
      setError("Error creating interpretation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Update an interpretation
  const updateInterpretation = async (interpretationId: string, diagnosis: string) => {
    setIsLoading(true);
    try {
      const response = await AXIOS_PUT(`/api/interpretation/${interpretationId}`, {
        diagnosis: diagnosis,
      });
      setRetInterpretations((prev) =>
        prev.map((interpretation) =>
          interpretation.interpretationId === interpretationId
            ? { ...interpretation, diagnosis: response.data.data.diagnosis }
            : interpretation
        )
      );
      setError(null);
    } catch (err) {
      setError("Error updating interpretation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete an interpretation
  const deleteInterpretation = async (interpretationId: string) => {
    setIsLoading(true);
    try {
      await AXIOS_DELETE(`/api/interpretation/${interpretationId}`);
      setRetInterpretations((prev) =>
        prev.filter((interpretation) => interpretation.interpretationId !== interpretationId)
      );
      setError(null);
    } catch (err) {
      setError("Error deleting interpretation");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <InterpretationContext.Provider
      value={{
        retInterpretations,
        isLoading,
        error,
        createInterpretation,
        getInterpretationByStudyId,
        updateInterpretation,
        deleteInterpretation,
      }}
    >
      {children}
    </InterpretationContext.Provider>
  );
};

// Custom hook to use context
export const useInterpretation = () => {
  const context = useContext(InterpretationContext);
  if (!context) {
    throw new Error("useInterpretation must be used within a InterpretationProvider");
  }
  return context;
};
