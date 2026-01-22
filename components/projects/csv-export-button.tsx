"use client";

import { CSVLink } from "react-csv";
import { buttonVariants } from "@/components/ui/button";
import { Download } from "lucide-react";
import { cn } from "@/lib/utils";

interface CsvExportButtonProps {
  data: object[];
  filename?: string;
}

export function CsvExportButton({ data, filename = "feedback.csv" }: CsvExportButtonProps) {
  if (data.length === 0) {
    return <>
      <Download className="mr-2 h-4 w-4" />
      <span>No Data</span>
    </>;
  }
  return (
    <CSVLink
      data={data}
      filename={filename}
      className={cn(buttonVariants({ variant: "default", size: "sm" }))}
    >
      <Download className="mr-2 h-4 w-4" />
      <span>Export</span>
    </CSVLink>
  );
}
