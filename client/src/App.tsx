import React from "react";
import Routes from "./Routes";
import Toaster from "./components/ui/toaster";

function App() {
  return (
    <div className="bg-black min-h-screen font-sans text-[#ffaa40]">
      <Routes />
      <Toaster />
    </div>
  );
}

export default App;