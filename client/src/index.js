import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import reportWebVitals from "./reportWebVitals";

import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);