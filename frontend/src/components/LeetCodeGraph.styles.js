import styled from 'styled-components';

export const ControlsContainer = styled.div`
  position: absolute;
  top: 160px;
  right: 20px;
  background-color: rgba(26, 26, 26, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 10px;

  label {
    display: block;
    color: #888;
    margin-bottom: 5px;
    font-size: 0.9rem;
  }
`;

export const ControlsTitle = styled.h3`
  color: white;
  font-size: 1.5rem;
  font-weight: 300;
  margin-bottom: 1.5rem;
`;

export const TimelineSlider = styled.input`
  width: 100%;
  height: 0.5rem;
  background: #374151;
  border-radius: 0.5rem;
  appearance: none;
  cursor: pointer;

  &::-webkit-slider-thumb {
    appearance: none;
    width: 1.5rem;
    height: 1.5rem;
    background: white;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  }

  &::-moz-range-thumb {
    width: 1.5rem;
    height: 1.5rem;
    background: white;
    border: none;
    border-radius: 9999px;
    cursor: pointer;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2);
  }
`;

export const StatsContainer = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
  background-color: rgba(26, 26, 26, 0.9);
  padding: 15px;
  border-radius: 8px;
  width: 250px;
  z-index: 20;
`;

export const Username = styled.h2`
  color: white;
  font-size: 2rem;
  font-weight: 500;
  margin: 0;
  margin-bottom: 0.5rem;
`;

export const StatsRow = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-top: 0.5rem;
`;

export const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 500;
  color: white;
`;

export const StatLabel = styled.span`
  font-size: 1.25rem;
  font-weight: 300;
  color: #9CA3AF;
`;

export const DifficultyStats = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 0.75rem;
`;

export const DifficultyItem = styled.div`
  color: ${props => props.color};
  font-size: 1.125rem;
  font-weight: 500;
`;

export const InstructionText = styled.div`
  position: absolute;
  bottom: -30px;
  right: 10px;
  color: #666;
  font-size: 1rem;
  pointer-events: none;
`;

export const SearchContainer = styled.div`
  position: absolute;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: ${props => props.show ? 'flex' : 'none'};
  align-items: center;
  gap: 8px;
  background: rgba(45, 45, 45, 0.98);
  padding: 6px 8px;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
  z-index: 1000;
  width: 600px;
`;

export const SearchInput = styled.input`
  background: transparent;
  border: none;
  color: #fff;
  padding: 4px;
  font-size: 14px;
  outline: none;
  width: 100%;

  &::placeholder {
    color: rgba(255, 255, 255, 0.4);
  }
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 16px;
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 20px;
  height: 20px;
  border-radius: 50%;
  
  &:hover {
    background: rgba(255, 255, 255, 0.1);
    color: rgba(255, 255, 255, 0.8);
  }
`;