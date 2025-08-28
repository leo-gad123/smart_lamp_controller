import React from "react";
import { BrowserRouter, Routes as RouterRoutes, Route } from "react-router-dom";
import ScrollToTop from "components/ScrollToTop";
import ErrorBoundary from "components/ErrorBoundary";
import NotFound from "pages/NotFound";
import SchedulingPage from './pages/scheduling';
import Login from './pages/login';
import Dashboard from './pages/dashboard';
import LampControlDetail from './pages/lamp-control-detail';
import Register from './pages/register';
import ScenesManagement from './pages/scenes-management';

const Routes = () => {
  return (
    <BrowserRouter>
      <ErrorBoundary>
      <ScrollToTop />
      <RouterRoutes>
        {/* Define your route here */}
        <Route path="/" element={<Dashboard />} />
        <Route path="/scheduling" element={<SchedulingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/lamp-control-detail" element={<LampControlDetail />} />
        <Route path="/register" element={<Register />} />
        <Route path="/scenes-management" element={<ScenesManagement />} />
        <Route path="*" element={<NotFound />} />
      </RouterRoutes>
      </ErrorBoundary>
    </BrowserRouter>
  );
};

export default Routes;
