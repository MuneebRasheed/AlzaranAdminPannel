import React, { useState } from 'react';
import {
  Collapse, Nav, NavItem, NavLink,
} from 'reactstrap';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { SiWindows11 } from 'react-icons/si';

function Sidebar() {
  const [isOpenColorType, setIsOpenColorType] = useState(false);
  const [isOpenManufacturer, setIsOpenManufacturer] = useState(false);
  const [isOpenTonner, setIsOpenTonner] = useState(false);
  const [isOpenColors, setIsOpenColors] = useState(false);
  const [isOpenCombineColors, setIsOpenCombineColors] = useState(false);
  const router = useRouter();

  const toggleColorType = () => {
    setIsOpenColorType(!isOpenColorType);
  };

  const toggleManufacturer = () => {
    setIsOpenManufacturer(!isOpenManufacturer);
  };

  const toggleTonner = () => {
    setIsOpenTonner(!isOpenTonner);
  };

  const toggleColors = () => {
    setIsOpenColors(!isOpenColors);
  };

  const toggleCombineColor = () => {
    setIsOpenCombineColors(!isOpenCombineColors);
  };

  const onAdminPanelClick = () => {
    router.push('/');
  };
  return (
    <div style={{ minWidth: '250px' }}>
      <Nav vertical className="sidebar p-0" style={{ minWidth: '250px' }}>
        <h5 className="p-4 ws" style={{ cursor: 'pointer' }} onClick={onAdminPanelClick}>Admin panel</h5>

        <NavItem style={isOpenColorType ? {
          borderLeft: '4px solid #19aa8d',
        } : {}}
        >
          <NavLink href="#" onClick={toggleColorType} className="nav-link s d-flex align-items-center justify-content-between">
            <span>
              <SiWindows11
                size={15}
                style={{
                  marginTop: '-2',
                  marginRight: '6px',
                }}
              />
              Color Type(s)
            </span>
            {isOpenColorType ? <FaChevronUp /> : <FaChevronDown />}
          </NavLink>
          <Collapse isOpen={isOpenColorType}>
            <Nav vertical>
              <NavItem>
                <Link href="/ColorType" className="nav-link s ps-5">
                  Type(s)
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>

        <NavItem style={isOpenManufacturer ? {
          borderLeft: '4px solid #19aa8d',
        } : {}}
        >
          <NavLink href="#" onClick={toggleManufacturer} className="nav-link s d-flex align-items-center justify-content-between">
            <span>
              <SiWindows11
                size={15}
                style={{
                  marginTop: '-2',
                  marginRight: '6px',
                }}
              />
              Manufacturer(s)
            </span>
            {isOpenManufacturer ? <FaChevronUp /> : <FaChevronDown />}
          </NavLink>
          <Collapse isOpen={isOpenManufacturer}>
            <Nav
              vertical

            >
              <NavItem>
                <Link href="/Manufacturer" className="nav-link s ps-5">
                  Manufacturer(s)
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>

        <NavItem style={isOpenTonner ? {
          borderLeft: '4px solid #19aa8d',
        } : {}}
        >
          <NavLink href="#" onClick={toggleTonner} className="nav-link s d-flex align-items-center justify-content-between">
            <span>
              <SiWindows11
                size={15}
                style={{
                  marginTop: '-2',
                  marginRight: '6px',
                }}
              />
              Tonner(s)
            </span>
            {isOpenTonner ? <FaChevronUp /> : <FaChevronDown />}
          </NavLink>
          <Collapse isOpen={isOpenTonner}>
            <Nav vertical>
              <NavItem>
                <Link href="/Tonner" className="nav-link s ps-5">
                  Tonners
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>

        <NavItem
          style={isOpenColors ? {
            borderLeft: '4px solid #19aa8d',
          } : {}}
        >
          <NavLink href="#" onClick={toggleColors} className="nav-link s d-flex align-items-center justify-content-between">
            <span>
              <SiWindows11
                size={15}
                style={{
                  marginTop: '-2',
                  marginRight: '6px',
                }}
              />
              Colors(s)
            </span>
            {isOpenColors ? <FaChevronUp /> : <FaChevronDown />}
          </NavLink>
          <Collapse isOpen={isOpenColors}>
            <Nav vertical>
              <NavItem>
                <Link href="/Colors" className="nav-link s ps-5">
                  Colors
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>

        <NavItem style={isOpenCombineColors ? {
          borderLeft: '4px solid #19aa8d',
        } : {}}
        >
          <NavLink href="#" onClick={toggleCombineColor} className="nav-link s d-flex align-items-center justify-content-between">
            <span>
              <SiWindows11
                size={15}
                style={{
                  marginTop: '-2',
                  marginRight: '6px',
                }}
              />
              Combine Color(s)
            </span>
            {isOpenCombineColors ? <FaChevronUp /> : <FaChevronDown />}
          </NavLink>
          <Collapse isOpen={isOpenCombineColors}>
            <Nav vertical>
              <NavItem>
                <Link href="/CombineColors" className="nav-link s ps-5">
                  Create Combination
                </Link>
              </NavItem>
            </Nav>
          </Collapse>
        </NavItem>

        {/* Add more accordion items similarly */}
      </Nav>
    </div>
  );
}

export default Sidebar;
