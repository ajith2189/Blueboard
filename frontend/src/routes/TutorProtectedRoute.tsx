import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RootState {
  auth: {
    user: any;
  };
}

const TutorProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login"  />;
  }

  if (user.role !== "tutor") {
    return <Navigate to="/tutor"  />;
  }

  return <>{children}</>;
};

export default TutorProtectedRoute;
