import React from "react";

interface TableProps<T> {
  columns: string[];
  data: T[];
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
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
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <img
                        src={row[col].image}
                        alt={row[col].text}
                        style={{
                          width: "30px",
                          height: "30px",
                          marginRight: "8px",
                        }}
                      />
                      <span>{row[col].text}</span>
                    </div>
                  ) : (
                    row[col]
                  )}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
