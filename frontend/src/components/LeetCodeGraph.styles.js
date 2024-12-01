import styled from 'styled-components';

export const ControlsContainer = styled.div`
  position: absolute;
  top: 1rem;
  right: 1rem;
  width: 24rem;
  padding: 1.5rem;
  background: #1E1E1E;
  border-radius: 0.75rem;
  backdrop-filter: blur(4px);
  font-size: 0.875rem;
  z-index: 50;
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
  top: 1rem;
  left: 1rem;
  padding: 1.5rem;
  background: #1E1E1E;
  border-radius: 0.75rem;
  backdrop-filter: blur(4px);
  z-index: 50;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
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