import React from 'react';
import ColorTonerTable from './ColorTonerTable';

export default function TonnerContent({ color }) {
  return (
    <div
      className="px-4 py-3"
      style={{
        border: '1px solid #00000079',
      }}
    >
      <div
        className="d-flex justify-content-center"
        style={{
          gap: '50px',
        }}
      >
        <div>
          <p>Color Information</p>
          <p>
            Manufacturer:
            {' '}
            {color?.manufactureName}
          </p>
          <p>
            Color code :
            {' '}
            {color?.colorCode}
          </p>
          <p>
            Color Name :
            {' '}
            {color?.colorName}
          </p>
          <p>
            Year :
            {' '}
            {color?.yearFrom}
            {' '}
            -
            {' '}
            {color?.yearTo}
          </p>
        </div>
        <div className="d-flex">
          {!color?.isCombineColor && (
            <>
              <div>
                <p>Color Shade</p>
                {color?.colorShade}
              </div>
              <div className="vertical-divider" />
            </>
          )}
          <ColorTonerTable color={color} />
        </div>
      </div>
    </div>
  );
}
