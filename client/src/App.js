import React from 'react';
import {BrowserRouter as Router} from "react-router-dom";
import 'materialize-css';

import {useRoutes} from "./routes";
import {useAuth} from "./hooks/auth.hook";
import {AuthContext} from "./context/auth.context";
import {NavBar} from "./components/navbar";
import {Loader} from "./components/loader";

function App() {
    const {token, userId, login, logout, ready} = useAuth();
    const isAuthentificated = !!token;
    const routes = useRoutes(isAuthentificated);

    if (!ready) {
        return <Loader />;
    }

    return (
        <AuthContext.Provider value={{
            token, login, logout, userId, isAuthentificated
        }}>
            <Router>
                { isAuthentificated ? <NavBar /> : null }

                <div className="container">
                    {routes}
                </div>
            </Router>
        </AuthContext.Provider>
    );
}

export default App;
