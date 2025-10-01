import { ReactNode } from "react";
import { Spinner } from '@/components/General';

type Column<T> = {
  key: keyof T | string;
  label: string | ReactNode;
  className?: string;     // estilos de ancho / color
  render?: (item: T) => ReactNode; // custom render
};

type FlexTableProps<T> = {
  columns: Column<T>[];
  data: T[];
  headerClassName?: string;
  rowClassName?: string;
  isLoading?: boolean;
  selectedRow?: number | null;
  selectRowFn?: (id: number) => void;
  currentPage?: number;
  numRows?: number;
  hoverSelect?: boolean;
};

export default function FlexTable<T extends object>({
  columns,
  data,
  headerClassName = "flex border-x pb-0.5",
  rowClassName = "flex border-x pb-0.5",
  isLoading = false,
  selectedRow = null,
  selectRowFn,
  currentPage = 1,
  numRows = 10,
  hoverSelect = true
}: FlexTableProps<T>) {

  const hoverClass = hoverSelect ? 'group-hover:bg-zinc-400' : '';
  const cursorClass = hoverSelect ? 'cursor-pointer' : '';
  
  return (
    <div className="flex-table">
      {/* Header */}
      <div className={headerClassName}>
        <div
          className={`text-sm font-bold text-center border-x px-1 py-2.5 content-center w-[3%]`}
        >
          N°
        </div>
        {columns.map((col, i) => (
          <div
            key={i}
            className={`text-sm font-bold text-center border-x px-1 py-2.5 content-center ${col.className ?? ""}`}
          >
            {col.label}
          </div>
        ))}
      </div>
      {/* { isLoading && <div className="flex justify-center py-2">
          <Spinner weight="3" size="size-10" colorClass="text-yellow-1"/>
      </div>} */}
      {/* Rows */}
      {data.length && data?.map((item, rowIndex) => {
        const isSelected = selectedRow === item.id;
        return (
          <div key={rowIndex} className={`${rowClassName} group`} onClick={() => selectRowFn?.(item.id)}>
            <div
              className={`text-lg border-x p-1 text-center uppercase w-[3%] ${isSelected ? 'bg-red-400' : hoverClass} ${cursorClass}`}
            >
              {(currentPage - 1) * numRows + (rowIndex + 1)}
            </div>
            {columns.map((col, colIndex) => (
              <div
                key={colIndex}
                className={`text-lg border-x p-1 uppercase text-center ${isSelected ? 'bg-red-400' : hoverClass} ${cursorClass} ${col.className ?? ""}`}
              >
                {col.render ? col.render(item) : (item[col.key as keyof T] as any)}
              </div>
            ))}
          </div>
        )}
      )}
    </div>
  );
}
