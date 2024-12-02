import React from 'react';
import { Th } from './styles';
import SortIcon from './SortIcon';

const TableHeader = ({ columns, sortConfig, onSort }) => (
  <thead>
    <tr>
      {columns.map(({ key, label, sortable }) => (
        <Th 
          key={key}
          onClick={() => sortable && onSort(key)}
          style={{ cursor: sortable ? 'pointer' : 'default' }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            {label}
            {sortable && (
              <SortIcon 
                active={sortConfig.key === key}
                direction={sortConfig.key === key ? sortConfig.direction : null}
              />
            )}
          </div>
        </Th>
      ))}
    </tr>
  </thead>
);

export default TableHeader; 