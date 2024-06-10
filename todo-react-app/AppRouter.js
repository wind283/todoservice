import React from "react";
import "./index.css";
import App from "./App.js";
import Login from "./Login.js";
import SignUp from "./SignUp.js";
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Box from "@mui/material/Box/index.js";
import Typography from "@mui/material/Typography/index.js";

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
                    <Route path="/signup" element={<SignUp />} />
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