import React from "react";

interface Action {
  title: string;
  action: string;
  icon: JSX.Element; // Thay đổi kiểu `icon` từ `string` sang `JSX.Element`
  style: React.CSSProperties; // Đảm bảo style là kiểu React hợp lệ
}
interface TableProps<T> {
  columns: string[];
  data: T[];
  handleAction?: (type: string, row: T) => void;
  actions: Action[];
}

const Table = <T extends Record<string, any>>({
  columns,
  data,
  handleAction = () => {},
  actions,
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
              backgroundColor: "#1e2753",
              color: "white",
              border: "1px solid #c9c9c9",
            }}
          >
            {columns &&
              columns.length > 0 &&
              columns.map((col, index) => (
                <th
                  key={index}
                  style={{
                    padding: "8px",
                    textAlign: "center",
                    border: "1px solid  #c9c9c9",
                  }}
                  className="uppercase"
                >
                  {col}
                </th>
              ))}
            <th style={{ padding: "8px", textAlign: "center" }}>ACTIONS</th>
          </tr>
        </thead>
        {data && data.length > 0 ? (
          <tbody style={{ backgroundColor: "white" }}>
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  border: "1px solid #c9c9c9",
                  color: "#1e2753",
                }}
              >
                {columns.map((col, colIndex) => (
                  <td
                    key={colIndex}
                    style={{
                      padding: "8px",
                      textAlign: "center",
                      border: "1px solid  #c9c9c9",
                    }}
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
                            width: "220px",
                            height: "120px",
                            marginRight: "8px",
                          }}
                        />

                        {row[col]?.text}
                      </div>
                    ) : col === "image" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <img
                          src={row[col]}
                          alt={row[col]}
                          style={{
                            width: "220px",
                            height: "120px",
                            marginRight: "8px",
                          }}
                        />
                      </div>
                    ) : row[col] === "" ? (
                      "None"
                    ) : col === "video" ? (
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <video
                          src={row[col]}
                          controls
                          style={{
                            width: "220px",
                            height: "120px",
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
                  {actions &&
                    actions.length > 0 &&
                    actions.map((action, id) => (
                      <button
                        key={id}
                        className="hover-action"
                        title={action.title}
                        style={action.style}
                        onClick={() => handleAction(action.action, row)}
                      >
                        {action.icon}
                      </button>
                    ))}
                </td>
              </tr>
            ))}
          </tbody>
        ) : (
          <tbody>
            <tr>
              <th>No data</th>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default Table;
