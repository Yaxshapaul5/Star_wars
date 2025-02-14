import { useState, useEffect } from "react";
import { Alert } from "./Alert";
import CharacterModal from "./Modal";
import styled from "styled-components";

export interface Character {
  name: string;
  height: string;
  mass: string;
  hair_color: string;
  skin_color: string;
  eye_color: string;
  birth_year: string;
  gender: string;
  homeworld: string;
  films: string[];
  species: string[];
  vehicles: string[];
  starships: string[];
  created: string;
  edited: string;
  url: string;
}

export interface ApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Character[];
}

const speciesColors: { [key: string]: string } = {
  "https://swapi.dev/api/species/1/": "#e4d26d",
  "https://swapi.dev/api/species/2/": "#C0C0C0",
  "https://swapi.dev/api/species/3/": "#4f51b6",
  "https://swapi.dev/api/species/4/": "#be5c5c",
  default: "#8daee0",
};

const StarWarsCharacters = () => {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [noOfData, setNoOfData] = useState<number>(10); 

  const fetchCharacters = async (limit: number): Promise<void> => {
    setLoading(true);
    setError(null);
    try {
      let allCharacters: Character[] = [];
      let url: string | null = `https://swapi.dev/api/people/?page=1`;
  
      while (allCharacters.length < limit && url) {
        const response = await fetch(url);
        if (!response.ok) throw new Error("Failed to fetch characters");
        const data: ApiResponse = await response.json();
  
        allCharacters = [...allCharacters, ...data.results];
  
        url = data.next; 
      }
  
      setCharacters(allCharacters.slice(0, limit)); 
    } catch (err) {
      setError("Wait for some time and try again!");
    } finally {
      setLoading(false);
    }
  };
  
  

  useEffect(() => {
    fetchCharacters(noOfData);
  }, [noOfData]);

  if (error) {
    return <Alert variant="destructive" title="Error" description={error} />;
  }

  return (
    <Container>
      <Header>
        <TopCharacters>Top Characters</TopCharacters>
        <Heading>Star Wars Universe</Heading>
        <Subtext>
          Explore the legendary characters from a galaxy far, far away...
        </Subtext>
      </Header>

      <CharactersGrid>
        {loading ? (
          <LoaderContainer>
            <Loader />
          </LoaderContainer>
        ) : (
          characters.map((character) => (
            <CharacterCard
              key={character.name}
              onClick={() => setSelectedCharacter(character)}
              style={{
                backgroundColor:
                  speciesColors[character.species[0]] ||
                  speciesColors["default"],
              }}
            >
              <ProfileImage
                src={`https://starwars-visualguide.com/assets/img/characters/${
                  character.url.match(/(\d+)\/$/)?.[1]
                }.jpg`}
                alt={character.name}
                onError={(e) => (e.currentTarget.src = "./../images.png")}
              />

              <CardContent>
                <Name>{character.name}</Name>
              </CardContent>
            </CharacterCard>
          ))
        )}
      </CharactersGrid>

      <DropdownContainer>
        <PageInfo>Select no of characters to display:</PageInfo>
        <DropdownMenu
          onChange={(e) => setNoOfData(Number(e.target.value))}
          value={noOfData}
        >
          <option value="5">5</option>
          <option value="10">10</option>
          <option value="15">15</option>
          <option value="20">20</option>
        </DropdownMenu>
      </DropdownContainer>

      {selectedCharacter && (
        <CharacterModal
          character={selectedCharacter}
          onClose={() => setSelectedCharacter(null)}
        />
      )}
    </Container>
  );
};

export default StarWarsCharacters;

const Container = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  overflow-y: hidden;
`;

const Header = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  margin-bottom: 16px;
`;

const TopCharacters = styled.h2`
  font-size: 0.9rem;
  color: #3380c7;
  margin-bottom: -8px;
  font-family: "Montserrat", sans-serif;
`;

const Heading = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  color: #222;
  margin-bottom: 6px;
  font-family: "Playfair Display", serif;
`;

const Subtext = styled.p`
  font-size: 1.2rem;
  color: #555;
  margin-top: 4px;
  font-family: "Roboto", sans-serif;
`;

const CharactersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 24px;
  @media (max-width: 768px) {
    grid-template-columns: repeat(1, 1fr);
  }
`;

const CharacterCard = styled.div`
  background-color: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  &:hover {
    transform: scale(1.05);
    box-shadow: 0 6px 10px rgba(0, 0, 0, 0.15);
  }
`;

const ProfileImage = styled.img`
  width: 100%;
  height: 300px;
  object-fit: cover;
`;

const CardContent = styled.div`
  padding: 10px;
  text-align: center;
`;

const Name = styled.h2`
  font-size: 1rem;
  font-weight: bold;
  font-family: "Playfair Display", serif;
`;

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;
`;

const Loader = styled.div`
  width: 50px;
  height: 50px;
  border: 5px solid #f3f3f3;
  border-top: 5px solid #8daee0;
  border-radius: 50%;
  animation: spin 1s linear infinite;

  @keyframes spin {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
`;

const DropdownContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 32px;
`;

const PageInfo = styled.span`
  font-size: 1rem;
  color: #666;
`;

const DropdownMenu = styled.select`
  padding: 8px 12px;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  color: black; 

  option {
    color: black; 
  }
`;
