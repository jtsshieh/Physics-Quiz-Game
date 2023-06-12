import React from "react";
import ReactDOM from "react-dom/client";
import App from "./index_route";
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import RightHandRule from './rhr/rhr';
import {MathJaxContext} from "better-react-mathjax";

const router = createBrowserRouter([
    {
        path: '/',
        element: <App />
    },
    {
        path: '/rhr',
        element: <RightHandRule />
    },
]);


ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
        <CssVarsProvider defaultMode="light">
            <MathJaxContext>
                <CssBaseline />
                <RouterProvider router={router} />
            </MathJaxContext>
        </CssVarsProvider>
  </React.StrictMode>
);
