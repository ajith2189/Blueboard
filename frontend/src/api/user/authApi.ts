import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
  

//--------------------Register-----------------------

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export const RegisterApi = async (Credentials: RegisterCredentials) => {
  try {
    const response = await axiosInstance.post("/auth/register", Credentials);
    return response.data;
  } catch (error) {

    // instance of AxiosError will let know the TS that this may be any kind of error
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

// ---------------------------Google Sign Up--------------------------- 

export const googleSignUp = async (credential: string) => {
  try {
    const response = await axiosInstance.post("/auth/google", { credential });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};


//----------------------Otp Verification-----------------------

export const OtpVerification = async (otp: string, email: string) => {
  try {
    const response = await axiosInstance.post("/auth/verify-otp", { otp, email });
    return response.data;
  } catch (error) {
    // instance of AxiosError will let know the TS that this may be any kind of error
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};

//---------------------Login-----------------------
interface LoginCredentials {
  email: string;
  password: string;
}

export const LoginApi = async (Credentials: LoginCredentials) => {
  try {
    const response = await axiosInstance.post("/auth/login", Credentials);
    return response.data;
  } catch (error) {

    // instance of AxiosError will let know the TS that this may be any kind of error
    if (error instanceof AxiosError && error.response) {
      throw error.response.data;
    }
    throw error;
  }
};
