import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface Props {
    data: any[];
    fileName?: string;
}

export default function ExcelDownLoad({ data, fileName }: Props) {
    const handleDownload = () => {
        if (!data || data.length === 0) {
            alert('데이터가 없습니다.');
            return;
        }
    

    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');

    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });

    saveAs(blob, `${fileName}.xlsx`);
}
return (<button onClick={handleDownload}
    style={{
        color: '#fff',
        backgroundColor: '#28a745', // 부트스트랩 색상
        padding: '10px 16px',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
        fontSize: '14px'
    }}
>엑셀 다운로드</button>);
}