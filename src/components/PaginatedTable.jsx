/* eslint-disable jsx-a11y/label-has-associated-control */
// PaginatedTable.js
import React, { useState } from 'react';
import {
  Table, Pagination, PaginationItem, PaginationLink, NavLink,
} from 'reactstrap';

function PaginatedTable({
  data, headers, showActions, onEdit, onDelete, isViewAction, onView,
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Calculate the total number of pages
  const totalPages = Math.ceil(data.length / pageSize);

  // Calculate the start and end index for the current page
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, data.length);

  // Get the current page data
  const currentPageData = data.slice(startIndex, endIndex);

  const handlePageClick = (page) => {
    setCurrentPage(page);
  };

  const handlePageSizeChange = (size) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to the first page when changing page size
  };

  return (
    <div>
      {/* Page size selector */}
      <div className="mb-3">
        <label htmlFor="pageSize" className="me-2">Page Size:</label>
        <select
          id="pageSize"
          onChange={(e) => handlePageSizeChange(Number(e.target.value))}
          value={pageSize}
        >
          <option value={10}>10</option>
          <option value={25}>25</option>
          <option value={50}>50</option>
          <option value={100}>100</option>
        </select>
      </div>

      <Table bordered striped>
        <thead>
          <tr>
            {headers.map((header, index) => (
              <th key={index}>{header.label}</th>
            ))}
            {showActions && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {currentPageData.map((item, index) => (
            <tr key={index}>
              {headers.map((header, idx) => (
                <td key={idx}>
                  {header.type === 'color' ? (
                    <div style={{ width: '100%', height: '20px', backgroundColor: item[header.key] }} />
                  ) : (
                    <>
                      {header.prefix ? header.prefix : ''}
                      {item[header.key]}
                    </>
                  )}
                </td>
              ))}
              {showActions && (
                <td>
                  <div className="d-flex align-items-center">
                    <NavLink
                      href="#"
                      className="text-primary me-2"
                      onClick={(e) => {
                        e.preventDefault();
                        if (onEdit) {
                          onEdit(item);
                        } else if (onView) {
                          onView(item);
                        }
                      }}
                    >
                      {isViewAction ? 'View' : 'Edit'}
                    </NavLink>
                    {' | '}
                    <NavLink
                      href="#"
                      className="text-danger ms-2"
                      onClick={(e) => {
                        e.preventDefault();
                        // Handle Delete click
                        onDelete(item);
                      }}
                    >
                      Delete
                    </NavLink>
                  </div>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </Table>

      <div className="d-flex align-items-center justify-content-between">
        {/* Display range of entries */}
        <div>
          Showing
          {' '}
          {startIndex + 1}
          {' '}
          to
          {' '}
          {endIndex}
          {' '}
          of
          {' '}
          {data.length}
          {' '}
          entries
        </div>

        {/* Pagination component */}
        <Pagination>
          <PaginationItem disabled={currentPage === 1}>
            <PaginationLink
              previous
              onClick={() => handlePageClick(currentPage - 1)}
            />
          </PaginationItem>

          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index} active={index + 1 === currentPage}>
              <PaginationLink onClick={() => handlePageClick(index + 1)}>
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem disabled={currentPage === totalPages}>
            <PaginationLink
              next
              onClick={() => handlePageClick(currentPage + 1)}
            />
          </PaginationItem>
        </Pagination>
      </div>
    </div>
  );
}

export default PaginatedTable;
