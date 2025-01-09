import AppRoutes from "./routes/index";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <div>
      <ToastContainer />
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
