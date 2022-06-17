import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chat from "./pages/Chat";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Profile from "./pages/Profile";
import ProtectedRoute from "./components/ProtectedRoute";
const App = () => {
  return (
    <div>
      <Router>
        <Routes>
          <Route path="/chat" element={
            <ProtectedRoute>
              <Chat/>
            </ProtectedRoute>
          }/>
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile/>
            </ProtectedRoute>
          }/>
          <Route path="/register" element={<Register/>}/>
          <Route path="/" element={<Login/>}/>
        </Routes>
      </Router>
      
    </div>
  )
}

export default App