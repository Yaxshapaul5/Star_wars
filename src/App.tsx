import React from "react";
import CharacterList from "./components/NewStars";
import "./styles.css"; 

const App: React.FC = () => {
  return (
    <div className="app-container">
      <CharacterList />
    </div>
  );
};

export default App;
