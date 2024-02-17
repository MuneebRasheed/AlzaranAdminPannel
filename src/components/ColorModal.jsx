import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter,
} from 'reactstrap';
import ColorTonerTable from './ColorTonerTable';
import CombineColorsTable from './CombineColorsTable';

function ColorModal({
  isOpen, toggle, color, data,
}) {
  return (
    <div>
      <Modal
        style={{
          minWidth: '90vw',
        }}
        isOpen={isOpen}
        toggle={toggle}
      >
        <ModalHeader>Color Formula.</ModalHeader>
        <ModalBody>
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
              {!color?.isCombineColor && (
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
              )}
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
                {color?.isCombineColor ? <CombineColorsTable color={color} data={data} /> : <ColorTonerTable color={color} />}
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="secondary" onClick={toggle}>Close</Button>
        </ModalFooter>
      </Modal>
    </div>
  );
}

export default ColorModal;
