import styled from 'styled-components';

export const ControlsContainer = styled.div`
  position: absolute;
  top: 140px;
  right: 20px;
  background: rgba(30, 30, 30, 0.9);
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 50;
  width: 280px;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);

  div {
    margin-bottom: 12px;
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
  background: rgba(30, 30, 30, 0.9);
  padding: 15px 20px;
  border-radius: 8px;
  z-index: 50;
  backdrop-filter: blur(4px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 280px;
`;

export const Username = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
  color: #e4e4e4;
`;

export const StatsRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
`;

export const StatValue = styled.span`
  font-size: 1.25rem;
  font-weight: 600;
  color: #e4e4e4;
`;

export const StatLabel = styled.span`
  font-size: 1rem;
  color: #888;
`;

export const DifficultyStats = styled.div`
  display: flex;
  gap: 15px;
  align-items: center;
`;

export const DifficultyItem = styled.div`
  font-size: 1.1rem;
  font-weight: 600;
  color: ${props => props.color};
  display: flex;
  align-items: center;
  
  &:before {
    content: '';
    display: inline-block;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: ${props => props.color};
    margin-right: 6px;
  }
`;

export const InstructionText = styled.div`
  position: absolute;
  bottom: 20px;
  left: 20px;
  color: #888;
  font-size: 1rem;
  pointer-events: none;
  background: rgba(0, 0, 0, 0.6);
  padding: 8px 12px;
  border-radius: 6px;
  backdrop-filter: blur(4px);
  z-index: 50;
  border: 1px solid rgba(255, 255, 255, 0.1);
`;