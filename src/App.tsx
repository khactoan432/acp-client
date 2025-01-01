import AppRoutes from "./routes/index";
import { BrowserRouter as Router } from "react-router-dom";

const App = () => {
  return (
    <div>
      <Router>
        <AppRoutes />
      </Router>
    </div>
  );
};

export default App;
