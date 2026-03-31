import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import {LoginPage} from "../pages/LoginPage";
import {RegisterPage} from "../pages/RegisterPage";
import { DashboardPage} from "../pages/DashboardPage";
import {BrowsePage} from "../pages/BrowsePage";
import {FavouritesPage} from  "../pages/FavouritePage"




function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            
              <LoginPage />
           
          }
        />

        <Route
          path="/register"
          element={
            
              <RegisterPage />
            
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            
              <DashboardPage />
          
          }
        />

        <Route
          path="/browse"
          element={
            
              <BrowsePage />
            
          }
        />

<Route path="/favourites" element={<FavouritesPage />} />

        {/* Default Route */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;