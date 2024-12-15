import React from "react";

interface TableProps<T> {
  columns: string[];
  data: T[];
  onRowEdit: (row: T) => void;
  onRowDelete: (row: T) => void;
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  onRowEdit = () => {},
  onRowDelete = () => {},
}: TableProps<T>) => {
  return (
    <div style={{ padding: "20px", width: "100%" }}>
      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
        }}
        border={1}
      >
        <thead>
          <tr
            style={{
              backgroundColor: "#fff",
              borderBottom: "1px solid #f2f2f2",
            }}
          >
            {columns.map((col, index) => (
              <th key={index} style={{ padding: "8px", textAlign: "center" }}>
                {col}
              </th>
            ))}
            <th style={{ padding: "8px", textAlign: "center" }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} style={{ borderBottom: "1px solid #f2f2f2" }}>
              {columns.map((col, colIndex) => (
                <td
                  key={colIndex}
                  style={{ padding: "8px", textAlign: "center" }}
                >
                  {col === "Name" && row[col]?.image ? (
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={row[col].image}
                        alt={row[col].text}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "8px",
                        }}
                      />

                      {row[col]?.text}
                    </div>
                  ) : col === "image" ? (
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={row[col]}
                        alt={row[col]}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "8px",
                        }}
                      />
                    </div>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
              <td style={{ padding: "8px", textAlign: "center" }}>
                <button
                  style={{
                    marginRight: "8px",
                    padding: "4px 8px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => onRowEdit(row)}
                >
                  Edit
                </button>
                <button
                  style={{
                    padding: "4px 8px",
                    backgroundColor: "#f44336",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer",
                  }}
                  onClick={() => onRowDelete(row)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
