import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

interface RootState {
  auth: {
    user: any;
  };
}

const AdminProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);
  console.log("the use state in admin is",user);

  if (!user) {
    return <Navigate to="/admin/login"  />;
  }

  if (user.role !== "admin") {
    return <Navigate to="/admin/login"  />;
  }
  return <>{children}</>;
};

export default AdminProtectedRoute;
