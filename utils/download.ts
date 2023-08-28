import XLSX from "xlsx";
import dayjs from "dayjs";
import { type BookDetailedResponse, type PublisherResponse } from "@/types/pb";

// https://github.com/SheetJS/sheetjs/issues/885
function numberFormatColumn(
  worksheet: XLSX.WorkSheet,
  col: number,
  fmt: string,
) {
  const range = XLSX.utils.decode_range(worksheet["!ref"]!);
  // note: range.s.r + 1 skips the header row
  for (let row = range.s.r + 1; row <= range.e.r; ++row) {
    const ref = XLSX.utils.encode_cell({ r: row, c: col });
    if (worksheet[ref] && worksheet[ref].t === "n") {
      worksheet[ref].z = fmt;
    }
  }
}

export function downloadReleasesXLSX(
  releases: BookDetailedResponse<{
    publisher: PublisherResponse;
  }>[],
  fileName?: string,
) {
  const data = releases.map((release) => ({
    name: release.name,
    volume:
      parseVolume(release.volume) > 0 && parseVolume(release.volume) < 9000
        ? parseVolume(release.volume)
        : "",
    price: release.price,
    date: dayjs.tz(release.publishDate).toDate(),
    publisher: release.expand?.publisher.name,
    edition: release.edition,
  }));

  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();

  XLSX.utils.sheet_add_aoa(
    worksheet,
    [["Tập", "Tên", "Giá", "Ngày phát hành", "Nhà xuất bản", "Phiên bản"]],
    { origin: "A1" },
  );

  numberFormatColumn(worksheet, 2, '#,##0 "₫"');
  numberFormatColumn(worksheet, 3, "dd-mm-yyyy");
  worksheet["!cols"] = [
    { wch: 50 },
    { wch: 3 },
    { wch: 10 },
    { wch: 10 },
    { wch: 20 },
    { wch: 20 },
  ];

  XLSX.utils.book_append_sheet(workbook, worksheet, "Lịch phát hành");
  XLSX.writeFile(workbook, `LPH_${fileName || "Tana.moe"}.xlsx`, {
    compression: true,
  });
}
