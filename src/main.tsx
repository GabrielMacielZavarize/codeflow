
import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { ToastProvider } from './hooks/use-toast';
import { Toaster } from "@/components/ui/sonner";

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ToastProvider>
      <App />
      <Toaster position="top-right" closeButton richColors />
    </ToastProvider>
  </React.StrictMode>
);
