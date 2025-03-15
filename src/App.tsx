import "./App.css";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import MintBoxWithWagmi from "./components/MintBoxWithWagmi";
import MintBoxWithEthersV6 from "./components/MintBoxWithEthersV6"; // Assuming you still have this component

export function App() {
  return (
    <Router>
      <div className={"pages"}>
        <div className="header">
          <appkit-button />
        </div>

        <nav className="navigation">
          <Link to="/wagmi" className="nav-button">
            Wagmi Implementation
          </Link>
          <Link to="/ethers" className="nav-button">
            Ethers V6 Implementation
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/wagmi" replace />} />
          <Route
            path="/wagmi"
            element={
              <div className="mintbox">
                <h2>Wagmi Implementation</h2>
                <MintBoxWithWagmi />
              </div>
            }
          />
          <Route
            path="/ethers"
            element={
              <div className="mintbox">
                <h2>Ethers Implementation</h2>
                <MintBoxWithEthersV6 />
              </div>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
