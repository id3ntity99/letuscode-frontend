import "./App.css";
import "./xterm.css";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import Console from "./Console";
import React from "react";

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/*
                    <Route path="/" element={<Login/>}/>
                    */
                }

                <Route path="/" element={<Console/>}/>
            </Routes>
        </BrowserRouter>
    )
}

export default App;
