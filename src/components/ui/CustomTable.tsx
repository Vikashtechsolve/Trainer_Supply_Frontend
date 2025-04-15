import React from "react";
type Column<T, K extends keyof T = keyof T> = {
  header: string;
  accessor: K;
  render?: (value: T[K], row: T) => React.ReactNode;
};

type CustomTableProps<T> = {
  data: T[];
  columns: Column<T>[];
  title: string;
};

function CustomTable<T extends { id: string }>({
  data,
  columns,
  title,
}: CustomTableProps<T>) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100">
      <div className="p-6 border-b border-gray-100">
        <h3 className="font-medium text-gray-800">{title}</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="text-sm text-left text-gray-500 border-b border-gray-100">
              {columns.map((column) => (
                <th
                  key={String(column.accessor)}
                  className="px-6 py-3 font-medium"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr
                key={row.id}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50"
              >
                {columns.map((column) => (
                  <td key={String(column.accessor)} className="px-6 py-4">
                    {column.render
                      ? column.render(row[column.accessor], row)
                      : String(row[column.accessor])}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomTable;
