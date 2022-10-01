import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./Home";
import Header from "./Header";
import reportWebVitals from "./reportWebVitals";
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className="container">
    <Header />
    <RouterProvider router={router} />
    </div>
  </React.StrictMode>
);