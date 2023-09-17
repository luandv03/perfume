import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Button } from "@mantine/core";
import { IconDownload } from "@tabler/icons-react";

export const ExportCSV = ({
    csvData,
    fileName,
}: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    csvData: any;
    fileName: string;
}) => {
    const fileType =
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
    const fileExtension = ".xlsx";

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const exportToCSV = (csvData: any, fileName: string) => {
        const ws = XLSX.utils.json_to_sheet(csvData);
        const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
        const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
        const data = new Blob([excelBuffer], { type: fileType });
        FileSaver.saveAs(data, fileName + fileExtension);
    };

    return (
        <Button onClick={() => exportToCSV(csvData, fileName)}>
            <IconDownload /> Export
        </Button>
    );
};
