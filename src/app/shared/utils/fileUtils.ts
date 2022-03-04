export function downloadFile(data: any, reportName: string) {
    const filename = `${reportName ? reportName : 'Report'}.xlsx`;
    const dataType = data.type;
    const downloadLink = document.createElement('a');
    downloadLink.href = window.URL.createObjectURL(
        new Blob([data], { type: dataType })
    );
    if (filename) downloadLink.setAttribute('download', filename);
    document.body.appendChild(downloadLink);
    downloadLink.click();
}