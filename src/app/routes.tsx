import { createBrowserRouter } from "react-router";
import { LandingPage } from "./pages/LandingPage";
import { AdminDashboard } from "./pages/AdminDashboard";
import { EmployeeDashboard } from "./pages/EmployeeDashboard";
import { BookingForm } from "./pages/BookingForm";
import { LoginPage } from "./pages/LoginPage";
import { RegisterPage } from "./pages/RegisterPage";
import { NotFoundPage } from "./pages/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: LandingPage,
  },
  {
    path: "/login",
    Component: LoginPage,
  },
  {
    path: "/register",
    Component: RegisterPage,
  },
  {
    path: "/admin",
    Component: AdminDashboard,
  },
  {
    path: "/employee",
    Component: EmployeeDashboard,
  },
  {
    path: "/booking",
    Component: BookingForm,
  },
  {
    path: "*",
    Component: NotFoundPage,
  },
]);