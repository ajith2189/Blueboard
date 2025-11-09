import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RootState {
  auth: {
    user: any;
  };
}

const UserProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  if (!user) {
    return <Navigate to="/login"  />;
  }

  if (user.role !== "user") {
    return <Navigate to="/"  />;
  }

  return <>{children}</>;
};

export default UserProtectedRoute;
