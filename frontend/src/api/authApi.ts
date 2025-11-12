// import { Response } from 'express';
// import { userGoogleLogin } from '@/api/userApi';
import axiosInstance from "@/utils/axios";
import { AxiosError } from "axios";
  

//--------------------Register-----------------------

interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
  role?: string;
}

export const userRegisterApi = async (Credentials: RegisterCredentials,) => {
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

export const usergoogleSignUp = async (credential:any,) => {
  try {

    const response = await axiosInstance.post("/auth/google", { credential});
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

export const userLoginApi = async (Credentials: LoginCredentials) => {
 return await axiosInstance.post("/auth/login", Credentials);
};

/////////////////////////////////////////reset password api//////////////////////////////////////

export const forgotPasswordApi = async (email: string) => {
  return axiosInstance.post("/auth/forgot-password-otp", { email });
};

export const verifyResetOtpApi = async (email: string, otp: string) => {
  console.log("reset totp called");
  return axiosInstance.post("/auth/verify-reset-otp", { email, otp });
};

export const resetPasswordApi = async (resetToken: string, password: string) => {
  return axiosInstance.post("/auth/reset-password", { resetToken, password });
};


export const TutorLoginApi = async (Credentials: LoginCredentials) => {
  return await axiosInstance.post("/auth/tutor/login", Credentials);
  }
    
