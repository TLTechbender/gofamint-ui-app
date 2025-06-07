"use client";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
interface ToastProviderProps {
  children: React.ReactNode;
}
export default function ReactToastifyProvider({ children }: { children: React.ReactNode }) {
  return (
    <>
      {children}
      <ToastContainer />
    </>
  );
}
