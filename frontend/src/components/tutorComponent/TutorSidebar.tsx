import React from 'react'
import AdminSidebar from '../shared/Sidebar'
import Sidebar from '../shared/Sidebar'

const sidebarItems = [
  { id: "dashboard", label: "Dashboard", icon: BarChart3, path: "/admin/" },
  { id: "category", label: "Category", icon: LayoutGrid, path: "/admin/categories" },
  { id: "students", label: "Students", icon: Users, path: "/admin/students" },
  { id: "tutors", label: "Tutors", icon: GraduationCap, path: "/admin/tutors" },
  { id: "courses", label: "Courses", icon: BookOpen, path: "/admin/courses" },
  { id: "orders", label: "Orders", icon: ShoppingCart, path: "/admin/orders" },
  { id: "settings", label: "Settings", icon: Settings, path: "/admin/settings" },
];


export const TutorSidebar = () => {
  return (
   <Sidebar sidebarItems = {sidebarItems} />
  )
}
