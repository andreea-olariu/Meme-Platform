import React from "react"
import { createBrowserRouter } from "react-router-dom"
import Home from "../pages/Home"
import Login from "../pages/Login"
import Register from "../pages/Register"
import PrivateRoute from "../common/components/PrivateRoute"
import Profile from "../pages/Profile"
import MemeMatcher from "../pages/Matcher"
import StalkCard from "../pages/Home/components/StalkCard";
import MemeGenerator from "../pages/Generator/components/MemeGenerator";
import Generate from "../pages/Generator";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <PrivateRoute />,
    children: [
      {
        path: "/",
        index: true,
        element: <Home />,
      },
      { path: "generate", element: <Generate /> },
      { path: "profile", element: <Profile /> },
      { path: "stalk/:username", element: <StalkCard /> },
      { path: "matcher", element: <MemeMatcher /> },
      { path: "generate/:id", element: <MemeGenerator /> }
    ],
  },
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
])
