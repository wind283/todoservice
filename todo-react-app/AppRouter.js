import React from "react";
import "./index.css";
import App from "./App";
import Login from "./Login";
import SignUp from "./SignUp";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

function Copyright() {
    return(
        <Typography variant = "body2" color="textSecondary" align = "center">
            {"Copyright ©"}
            fsoftwareengineer, {new Date().getFullYear()}
            {"."}
        </Typography>
    );
}

class AppRouter extends React.Component {
    render() {
        return(
        <BrowserRouter>
            <div>
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/singup" element={<SignUp />} />
                    <Route path="/" element={<App />} />
                </Routes>
            </div>
            <div>
                <Box mt = {5}>
                    <Copyright />
                </Box>
            </div>
        </BrowserRouter>
        );
    }
}
export default AppRouter;