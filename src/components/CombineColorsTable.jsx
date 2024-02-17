import React, { useMemo, useState } from 'react';
import { Table } from 'reactstrap';
import TonnerContent from './TonnerContent';

export default function CombineColorsTable({ color, data }) {
  const { combineColors } = color;

  const array = useMemo(() => {
    if (!combineColors || !data) return []; // Return an empty array if combineColors or colors is not defined
    return data.filter((t) => combineColors.includes(t.id));
  }, [data, combineColors]);

  const [visbleTonnerContent, setVisibleTonnerContent] = useState(null);

  const onRowClick = (colorMap) => {
    setVisibleTonnerContent(colorMap);
  };

  return (
    <div>

      <Table bordered striped>
        <thead>
          <tr>
            <th>Color Shade</th>
            <th>Manufacturer</th>
            <th>Color Code</th>
            <th>Variant</th>
            <th>Color Name</th>
            <th>Year</th>
          </tr>
        </thead>
        <tbody>
          {array.map(
            (colorMap, index) => (
              <tr key={index} onClick={() => onRowClick(colorMap)}>
                <td>
                  {colorMap.colorShade}
                </td>
                <td>
                  {colorMap.manufactureName}
                </td>
                <td>
                  {colorMap.colorCode}
                </td>
                <td>
                  {colorMap.variant}
                </td>
                <td>
                  {colorMap.colorName}
                </td>
                <td>
                  {colorMap.year}
                </td>
              </tr>
            ),
          )}

        </tbody>
      </Table>
      {visbleTonnerContent && (<TonnerContent color={visbleTonnerContent} />)}
    </div>

  );
}
