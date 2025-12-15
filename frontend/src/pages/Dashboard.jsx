// src/pages/Dashboard.jsx
import React, { useEffect } from "react";
import Sidebar from "../components/Sidebar";
import { Outlet } from "react-router-dom";
import api from "../utils/api"; // import your centralized API
import Footer from "@/components/Footer";

const Dashboard = () => {

  // fetch data when Dashboard loads
  const fetchData = async () => {
    try {
      const res = await api.get('/protected-data');
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="flex">
      {/* Sidebar stays fixed on the left */}
      <Sidebar />

      {/* Content on the right */}
      <div className="flex-1 min-h-screen">
        <Outlet />
       
      </div>
    </div>
  );
};

export default Dashboard;
