import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import styled from "styled-components";

interface ModalProps {
  character: Character | null;
  onClose: () => void;
}

interface Homeworld {
  name: string;
  terrain: string;
  climate: string;
  population: string;
  residents: string[];
}

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled(motion.div)`
  background: whitesmoke;
  padding: 20px;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
  position: relative;
  color: black;
  display: flex;
  flex-direction: column;
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: black;
  outline: none;
`;

const Title = styled.h2`
  margin-bottom: 10px;
  text-align: center;
  font-family: 'Playfair Display', serif;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
`;

const Column = styled.div`
  flex: 1;
  text-align: left;
`;

const BoldKey = styled.span`
  font-weight: bold;
  font-family: 'Roboto', sans-serif;
`;

const CharacterModal: React.FC<ModalProps> = ({ character, onClose }) => {
  const [homeworld, setHomeworld] = useState<Homeworld | null>(null);

  useEffect(() => {
    if (character?.homeworld) {
      fetch(character.homeworld)
        .then((res) => res.json())
        .then((data) => setHomeworld(data))
        .catch(() => setHomeworld(null));
    }
  }, [character]);

  if (!character) return null;

  const formattedDate = new Date(character.created).toLocaleDateString("en-GB");
  const numberOfResidents = homeworld?.residents.length || 0;

  return (
    <ModalOverlay onClick={onClose}>
      <ModalContent
        onClick={(e) => e.stopPropagation()}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <CloseButton onClick={onClose}>x</CloseButton>
        <Title>{character.name}</Title>
        <ContentContainer>
          <Column>
            <p><BoldKey>Height:</BoldKey> {parseFloat(character.height) / 100}m</p>
            <p><BoldKey>Mass:</BoldKey> {character.mass}kg</p>
            <p><BoldKey>Birth Year:</BoldKey> {character.birth_year}</p>
            <p><BoldKey>Films:</BoldKey> {character.films.length}</p>
            <p><BoldKey>Created On:</BoldKey> {formattedDate}</p>
          </Column>
          {homeworld && (
            <Column>
              <p><BoldKey>Homeworld:</BoldKey> {homeworld.name}</p>
              <p><BoldKey>Terrain:</BoldKey> {homeworld.terrain}</p>
              <p><BoldKey>Climate:</BoldKey> {homeworld.climate}</p>
              <p><BoldKey>Population:</BoldKey> {homeworld.population}</p>
              <p><BoldKey>Residents:</BoldKey> {numberOfResidents}</p>
            </Column>
          )} 
        </ContentContainer>
      </ModalContent>
    </ModalOverlay>
  );
}

export default CharacterModal;
