import { lazy } from "react";

export const LazyHome = lazy(() => import("./home/Home"));
export const LazyAbout = lazy(() => import("./about/About"));
export const LazyLegals = lazy(() => import("./legals/Legals"));
export const LazyLocations = lazy(() => import("./locations/Locations"));
export const LazyLogin = lazy(() => import("./login/Login"));
export const LazyRegister = lazy(() => import("./register/Register"));
export const LazyAdminHome = lazy(() => import("./admin/AdminHome"));
export const LazyAdminUsers = lazy(() => import("./admin/adminUsers/AdminUsers"));
export const LazyAdminElements = lazy(() => import("./admin/adminElements/AdminElements"));
export const LazyProfile = lazy(() => import("./profile/Profile"));
export const LazyProjects = lazy(() => import("./projects/Projects"));
export const LazySimulator = lazy(() => import("./simulator/Simulator"));
