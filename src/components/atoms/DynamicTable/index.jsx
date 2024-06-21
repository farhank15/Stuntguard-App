import React from "react";

const DynamicTable = ({ data }) => {
  return (
    <div className="overflow-x-auto px-4">
      <table className="table w-full table-zebra">
        <thead>
          <tr>
            {data.length > 0 &&
              Object.keys(data[0]).map((key) => (
                <th key={key} className="px-4 py-2 border-b">
                  {key.replace("_", " ").toUpperCase()}
                </th>
              ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-100">
              {Object.values(row).map((value, colIndex) => (
                <td key={colIndex} className="px-4 py-2 border-b">
                  {value}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
