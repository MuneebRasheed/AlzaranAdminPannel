import React from 'react';
import { Table } from 'reactstrap';

function TonnerTable({ tonners = [], getTonnerColor, onDelete }) {
  return (
    <Table bordered striped>
      <thead>
        <tr>
          <th>Tonner</th>
          <th>ABS</th>
          <th>Mass Tone</th>
          <th />
        </tr>
      </thead>
      <tbody>
        {
          tonners.map(({ tonner, abs, stage }, index) => (
            <tr key={index}>
              <td>{tonner.label}</td>
              <td>{abs}</td>
              <td>
                <div style={{ width: '100%', height: '20px', backgroundColor: getTonnerColor(tonner.value) }} />
              </td>
              <td>
                <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDelete(stage, tonner.value)}>
                  X
                </p>
                {' '}
                {/* Cross icon with red color */}
              </td>
            </tr>
          ))

        }
        {/* Add more rows as needed */}
      </tbody>
    </Table>
  );
}

export default TonnerTable;
