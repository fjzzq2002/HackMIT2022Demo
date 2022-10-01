import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Header from "./Header";
import User, {
  loader as userLoader,
} from "./User";
import Article, {
  loader as articleLoader,
} from "./Article";
import Home, {
  loader as homeLoader,
} from "./Home";
import Write from "./Write";
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
    loader: homeLoader
  },
  {
    path: "user/:userId",
    element: <User />,
    loader: userLoader
  },
  {
    path: "read/:articleId",
    element: <Article />,
    loader: articleLoader
  },
  {
    path: "write",
    element: <Write />
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <div className="container">
    <div className="mycontainer Nunito">
    <Header />
    <RouterProvider router={router} />
    </div>
    </div>
  </React.StrictMode>
);