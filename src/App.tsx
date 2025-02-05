import React from "react";
import CharacterList from "./components/StarWarsCharacters";
import "./styles.css"; // Import the CSS file

const App: React.FC = () => {
  return (
    <div className="app-container">
      <CharacterList />
    </div>
  );
};

export default App;
