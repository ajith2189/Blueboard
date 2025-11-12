import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import type {User} from "../api/adminApi";

interface RootState {
  auth: {
    user: User;
  };
}

const TutorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/tutor/login"  />;
  }

  if (user.role !== "tutor") {
    return <Navigate to="/tutor/login"  />;
  }
  return <>{children}</>;
};

export default TutorProtectedRoute;
