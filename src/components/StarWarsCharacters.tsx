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
    "https://swapi.dev/api/species/3/": "#4f51b6", // Wookiee - BlueViolet
    "https://swapi.dev/api/species/4/": "#be5c5c", // Rodian - Brown
    "default": "#8daee0" // Default color - SteelBlue
};

const StarWarsCharacters = () => {
    const [characters, setCharacters] = useState<Character[]>([]);
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [totalPages, setTotalPages] = useState<number>(0);
    const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(null);

    const fetchCharacters = async (page: number): Promise<void> => {
        setLoading(true);
        setError(null);
        try {
            const response = await fetch(`https://swapi.dev/api/people/?page=${page}`);
            if (!response.ok) throw new Error("Failed to fetch characters");
            const data: ApiResponse = await response.json();
            setCharacters(data.results);
            setTotalPages(Math.ceil(data.count / 10));
        } catch (err) {
            setError("Wait for some time and try again!");
        } finally {
            setLoading(false);
        }
    };
    

    useEffect(() => {
        fetchCharacters(currentPage);
    }, [currentPage]);

    if (error) {
        return <Alert variant="destructive" title="Error" description={error} />;
    }

    return (
        <Container>
            <Header>
                <TopCharacters>Top Characters</TopCharacters>
                <Heading>Star Wars Universe</Heading>
                <Subtext>Explore the legendary characters from a galaxy far, far away...</Subtext>
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
                            style={{ backgroundColor: speciesColors[character.species[0]] || speciesColors["default"] }}
                        >
                           <ProfileImage
    src={`https://starwars-visualguide.com/assets/img/characters/${character.url.match(/(\d+)\/$/)?.[1]}.jpg`}
    alt={character.name}
    onError={(e) => (e.currentTarget.src = "/fallback-image.jpg")}
/>

                            <CardContent>
                                <Name>{character.name}</Name>
                            </CardContent>
                        </CharacterCard>
                    ))
                )}
            </CharactersGrid>

            {!loading && (
                <PaginationContainer>
                    <PaginationButton
                        onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                    >
                        Previous
                    </PaginationButton>
                    <PageInfo>Page {currentPage} of {totalPages}</PageInfo>
                    <PaginationButton
                        onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </PaginationButton>
                </PaginationContainer>
            )}

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
    font-family: 'Montserrat', sans-serif;
`;

const Heading = styled.h1`
    font-size: 2.5rem;
    font-weight: bold;
    color: #222;
    margin-bottom: 6px; 
     font-family: 'Playfair Display', serif;
`;

const Subtext = styled.p`
    font-size: 1.2rem;
    color: #555;
    margin-top: 4px; 
    font-family: 'Roboto', sans-serif;
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
    font-size: 1.0rem;
    font-weight: bold;
         font-family: 'Playfair Display', serif;

`;

const PaginationContainer = styled.div`
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

const PaginationButton = styled.button`
    padding: 10px 16px;
    background-color:#8daee0;
    color: white;
    border: none;
    border-radius: 8px;
    cursor: pointer;
    &:disabled {
        background-color: #bdc3c7;
    }
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
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
