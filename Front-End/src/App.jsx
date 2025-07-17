import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Routes/AppRoutes";
import Login from "./pages/Login";


function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;
