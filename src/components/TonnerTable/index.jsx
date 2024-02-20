import React from 'react';
import { Table } from 'reactstrap';

function TonnerTable({ tonners = [], getTonnerColor, onDelete }) {
  let styless={"fontSize": "12px",  

  "height": "10px !important",
  "width": "10px !important",
  "padding": "0px",


}
let stylessWeight={"fontSize": "12px",  

  "height": "10px !important",
  "width": "10px !important",
  "padding": "0px",
  fontWeight:"800"

}
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
              <td style={stylessWeight}> <span >{tonner.label}</span></td>
              <td style={styless}><span>{abs}</span></td>
              <td style={styless}>
                <div style={{ width: '100%', height: '15px', backgroundColor: getTonnerColor(tonner.value),marginTop:"5px" }} />
              </td>
              <td style={styless}>
                <p style={{ color: 'red', cursor: 'pointer' }} onClick={() => onDelete(stage, tonner.value)}>
                  X
                </p>
                {' '}
            
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
