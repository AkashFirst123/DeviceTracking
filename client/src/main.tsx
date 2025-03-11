import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";

// For demo purposes, set a temporary user ID
// In a real app, this would come from authentication
if (!localStorage.getItem("userId")) {
  localStorage.setItem("userId", "1");
}

createRoot(document.getElementById("root")!).render(<App />);
