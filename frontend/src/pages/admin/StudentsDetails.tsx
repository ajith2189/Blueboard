import React from "react";
import DetailsTable from "@/components/adminComponents/DetailsTable/DetailsTable"; // This is now stubbed below

import { getAllUsers, blockUser } from "@/api/adminApi";
const StudentsDetails: React.FC = () => {
  return (
    <DetailsTable
      getFunction={getAllUsers}
      blockFunction={blockUser} // Pass the specific block function for users
      title="Students"
      initialParams={{ role: "user" ,limit: 3}} // Filter by role
    />
  );
};
export default StudentsDetails;


