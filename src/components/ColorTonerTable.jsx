import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import {
  Input, Table, Nav, NavItem, NavLink, Row, Col,
} from 'reactstrap';

export default function ColorTonerTable({ color }) {
  const { tonners } = useSelector((state) => state.tonner);
  const { stageOneTonner = [], stageTwoTonner = [] } = color || {};
  const [colorQty, setColorQty] = useState(1);
  const [volume, setVolume] = useState(1);
  const [activeTab, setActiveTab] = useState('1');

  const toggle = (tab) => {
    if (activeTab !== tab) setActiveTab(tab);
  };

  const handleVolumeChange = (e) => {
    const newValue = parseFloat(e.target.value); // Parse the input value to an integer
    setVolume(e.target.value);
    // Check if the entered value is greater than one
    if (newValue > 1) {
      setColorQty(newValue); // Set colorQty to the entered value
    } else {
      setColorQty(1); // Otherwise, set colorQty to 1
    }
  };

  const getTonner = (id) => tonners.find((t) => t.id === id) || {};

  const transformedStageOne = useMemo(
    () => stageOneTonner.map((t) => ({ ...t, ...getTonner(t.tonner) })),
    [stageOneTonner, tonners],
  );

  const transformedStageTwo = useMemo(
    () => stageTwoTonner.map((t) => ({ ...t, ...getTonner(t.tonner) })),
    [stageTwoTonner, tonners],
  );

  const getBody = (stageArray = []) => {
    const withAccumulate = [];

    const getAccumulateValue = (index, currentWeight) => {
      if (index === 0) {
        return currentWeight;
      }
      return parseFloat(currentWeight) + parseFloat(withAccumulate[index - 1].accumulated);
    };

    const totalAbsWeight = stageArray.reduce(
      (sum, value) => sum + Math.abs(value.abs),
      0,
    );
    const absWeightPercentage = stageArray.map(
      (value) => value.abs / totalAbsWeight,
    );
    const colorPerLiterPercentage = absWeightPercentage.map(
      (value, index) => value * stageArray[index].weightPerLiter,
    );
    const sumOfColorPerLiterPercentage = colorPerLiterPercentage.reduce(
      (sum, value) => sum + Math.abs(value),
      0,

    );
    const absColorPerLiter = colorPerLiterPercentage.map(
      (value, index) => (value / stageArray[index].weightPerLiter) *
          sumOfColorPerLiterPercentage,
    );

    const sumOfAbsColorPerLiter = absColorPerLiter.reduce((sum, value) => sum + Math.abs(value), 0);

    const weightUnitPerLiter = stageArray.map((value, index) => (value.weightPercentage / 1000) * absColorPerLiter[index]);

    const sumOfWeightUnitPerLiter = weightUnitPerLiter.reduce((sum, value) => sum + Math.abs(value), 0);

    const finalizedQty = weightUnitPerLiter.map((value) => (value / sumOfWeightUnitPerLiter) * sumOfAbsColorPerLiter);
    finalizedQty.sort((a, b) => b - a);

    stageArray.forEach((value, index) => {
      const weight = parseFloat((finalizedQty[index] * colorQty).toFixed(2));
      const accumulated = parseFloat(getAccumulateValue(index, weight)).toFixed(2);

      withAccumulate.push({
        ...value,
        weight,
        accumulated,
      });
    });
    return withAccumulate;
  };

  const withAccumulate = getBody(activeTab === '1' && transformedStageOne.length !== 0 ? transformedStageOne : transformedStageTwo);

  return (
    <div>
      {stageTwoTonner.length !== 0 && transformedStageOne.length !== 0 && (
      <Row className="mt-3">
        <Col>
          <Nav tabs>
            <NavItem>
              <NavLink
                className={activeTab === '1' ? 'active' : ''}
                onClick={() => { toggle('1'); }}
                style={{
                  cursor: 'pointer',
                }}
              >
                Stage One
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink
                className={activeTab === '2' ? 'active' : ''}
                onClick={() => { toggle('2'); }}
                style={{
                  cursor: 'pointer',
                }}
              >
                Stage Two
              </NavLink>
            </NavItem>
          </Nav>
        </Col>
      </Row>
      )}
      <Table bordered striped>
        <thead>
          <tr>
            <th>Tonner</th>
            <th>Weight</th>
            <th>Accumulated</th>
            <th>Mass Tone</th>
          </tr>
        </thead>
        <tbody>
          {withAccumulate.map(
            ({
              tonner, tonnerCodeColor, weight, accumulated,
            }, index) => (
              <tr key={index}>
                <td>{tonner}</td>
                <td>{weight}</td>
                <td>{accumulated}</td>
                <td>
                  <div
                    style={{
                      width: '100%',
                      height: '20px',
                      backgroundColor: tonnerCodeColor,
                    }}
                  />
                </td>
              </tr>
            ),
          )}
        </tbody>
        <tfoot>
          <div>
            <p className="m-0">Volume</p>
            <Input
              type="number"
              style={{
                borderWidth: '1px',
                width: '90px',
              }}
              min={1}
              onChange={handleVolumeChange}
              value={volume}
            />
          </div>
        </tfoot>
      </Table>
    </div>
  );
}
