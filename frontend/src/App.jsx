import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Homepage from "./pages/Homepage";
import AdminPanel from "./pages/AdminPanel";
import ProblemPage from "./pages/ProblemPage";

import { useDispatch, useSelector } from "react-redux";
import { checkAuth } from "./authSlice";
import { useEffect } from "react";

function App() {
  const { isAuthenticated,user ,loading} = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

   if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-lg"></span>
    </div>;
  }

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated ? <Homepage /> : <Navigate to="/signup" />
        }
      />

      <Route
        path="/login"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Login />
        }
      />

      <Route
        path="/signup"
        element={
          isAuthenticated ? <Navigate to="/" /> : <Signup />
        }
      />
       <Route
  path="/AdminPanel"
  element={
    isAuthenticated ? <AdminPanel /> : <Navigate to="/login" />
  }
/>
<Route path="/problem/:problemId" element={<ProblemPage/>}></Route>
    </Routes>
  );
}

export default App;