// src/index.tsx
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles/main.scss";
import { Provider } from "react-redux";
import store from "./redux/store";

localStorage.setItem("collapsed", JSON.stringify(true));

ReactDOM.createRoot(document.getElementById("root")!).render(
  <Provider store={store}>
    <App />
  </Provider>
);
