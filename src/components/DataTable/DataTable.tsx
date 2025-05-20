import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";

export interface Column<T> {
  header: string;
  accessorKey: any;
  cell?: (item: T) => React.ReactNode;
  sortable?: boolean;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  totalItems: number;
  pageSize: number;
  pageIndex: number;
  searchable?: boolean;
  searchPlaceholder?: string;
  searchColumn?: keyof T;
  onSearch?: (search: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onSort?: (
    column: keyof T | ((row: T) => React.ReactNode),
    direction: "asc" | "desc"
  ) => void;
  isLoading?: boolean;
}

export function DataTable<T>({
  columns,
  data,
  totalItems,
  pageSize,
  pageIndex,
  searchable = true,
  searchPlaceholder = "Search...",
  onSearch,
  onPageChange,
  onPageSizeChange,
  onSort,
  isLoading = false,
}: DataTableProps<T>) {
  const [search, setSearch] = useState("");
  const [sortColumn, setSortColumn] = useState<
    keyof T | ((row: T) => React.ReactNode) | null
  >(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const totalPages = Math.ceil(totalItems / pageSize);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    if (onSearch) {
      onSearch(value);
    }
  };

  const handleSort = (column: Column<T>) => {
    if (!column.sortable || !onSort) return;

    const key = column.accessorKey;

    if (sortColumn === key) {
      const newDirection = sortDirection === "asc" ? "desc" : "asc";
      setSortDirection(newDirection);
      onSort(key, newDirection);
    } else {
      setSortColumn(key);
      setSortDirection("asc");
      onSort(key, "asc");
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-col md:flex-row gap-4 justify-between">
        {searchable && (
          <div className="flex items-center w-full md:w-72 relative">
            <Input
              placeholder={searchPlaceholder}
              value={search}
              onChange={handleSearchChange}
              className="pl-10"
            />
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
          </div>
        )}
        <div className="flex items-center gap-2">
          <p className="text-sm text-muted-foreground">Rows per page</p>
          <Select
            value={pageSize.toString()}
            onValueChange={(value) => onPageSizeChange(Number(value))}
          >
            <SelectTrigger className="w-16">
              <SelectValue placeholder={pageSize} />
            </SelectTrigger>
            <SelectContent>
              {[10, 20, 30, 50, 100].map((size) => (
                <SelectItem key={size} value={size.toString()}>
                  {size}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column, idx) => (
                <TableHead
                  key={idx}
                  className={
                    column.sortable ? "cursor-pointer hover:bg-muted/50" : ""
                  }
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-1">
                    {column.header}
                    {column.sortable && sortColumn === column.accessorKey && (
                      <span className="ml-1">
                        {sortDirection === "asc" ? "↑" : "↓"}
                      </span>
                    )}
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    <span className="mt-2 text-sm text-muted-foreground">
                      Loading...
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="text-center py-10"
                >
                  <div className="flex flex-col items-center justify-center">
                    <span className="text-sm text-muted-foreground">
                      No data available
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              data.map((row, rowIdx) => (
                <TableRow key={rowIdx}>
                  {columns.map((column, colIdx) => (
                    <TableCell key={colIdx}>
                      {column.cell
                        ? column.cell(row)
                        : typeof column.accessorKey === "function"
                        ? column.accessorKey(row)
                        : (row[column.accessorKey] as React.ReactNode)}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          Showing {data.length ? pageIndex * pageSize + 1 : 0} to{" "}
          {Math.min((pageIndex + 1) * pageSize, totalItems)} of {totalItems}{" "}
          entries
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(0)}
            disabled={pageIndex === 0}
          >
            <ChevronsLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageIndex - 1)}
            disabled={pageIndex === 0}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="text-sm text-muted-foreground">
            Page {pageIndex + 1} of {totalPages || 1}
          </div>

          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(pageIndex + 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => onPageChange(totalPages - 1)}
            disabled={pageIndex >= totalPages - 1}
          >
            <ChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
