/* eslint-disable no-undef */
const functions = (({app, lib, globalVars}) => {
    const {poApp} = app;
    const thisAppClient = lib.client();
    const poAppClient = lib.client();
    return {
        getTextFromCell: (cell) => {
            if (cell.type === ExcelJS.ValueType.RichText) {
                return cell.value.richText
                    .map((part) => part.text)
                    .join('')
                    .split('\n');
            } else if (cell.type === ExcelJS.ValueType.String) {
                if (cell.value.includes('\n')) {
                    return cell.value.split('\n');
                }
                return cell.value;
            } else if (cell.type === ExcelJS.ValueType.Formula) {
                return cell.result; // In case the cell is a formula, you might want the result
            } else if (cell.type === ExcelJS.ValueType.Number) {
                return cell.value;
            }
            return cell.value;
        },
        convertDateFormat: (isoDate) => {
            // Create a Date object from the ISO date string
            const date = new Date(isoDate);
            if (date.toString() === 'Invalid Date') {
                return '';
            }
            // Extract the year, month, and day components
            const year = date.getUTCFullYear();
            const month = String(date.getUTCMonth() + 1).padStart(2, '0'); // getUTCMonth() returns month index (0-11), so add 1
            const day = String(date.getUTCDate()).padStart(2, '0');

            // Return the date in YYYY-MM-DD format
            return `${year}-${month}-${day}`;
        },
        // eslint-disable-next-line max-statements
        downloadExcelFile: async (record) => {
            const excelAttachment = record.excelAttachment.value;
            const newRecords = [];
            // Iterate each excel attachment in the record
            for (const item of excelAttachment) {
                if (
                    item.contentType ===
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
                ) {
                    // download every excel attachment in the record
                    const downloadExcelFile = await thisAppClient.file.downloadFile({
                        fileKey: item.fileKey,
                    });

                    // Access the downloaded excel attachment
                    const workbook = new ExcelJS.Workbook();
                    await workbook.xlsx.load(downloadExcelFile);
                    const worksheet = workbook.worksheets[0];
                    // Variable to make a condition if the attachment has the exact same template with PO template
                    const headerTitle = worksheet.getCell('E1').value;
                    const headerPoNo = worksheet.getCell('G3').value;
                    const headerDate = worksheet.getCell('I4').value;
                    if (
                        headerTitle !== 'PURCHASE ORDER' &&
            headerPoNo !== 'P.O. NUMBER:' &&
            headerDate !== 'Date:'
                    ) {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: item.name +
                            ' is not a correct Purchase Order Excel Please Check it again',
                        });
                    } else {
                        const poNumber = functions.getTextFromCell(worksheet.getCell('J3'));
                        const poDateString = functions.convertDateFormat(
                            functions.getTextFromCell(worksheet.getCell('J4')),
                        );
                        const customerArray = functions.getTextFromCell(
                            worksheet.getCell('A7'),
                        );
                        const billToArray = functions.getTextFromCell(
                            worksheet.getCell('D7'),
                        );
                        const deliverToArray = functions.getTextFromCell(
                            worksheet.getCell('H7'),
                        );
                        const startDate = functions.convertDateFormat(
                            functions.getTextFromCell(worksheet.getCell('A9')),
                        );
                        const cancelDate = functions.convertDateFormat(
                            functions.getTextFromCell(worksheet.getCell('B9')),
                        );
                        const orderBy = functions.getTextFromCell(worksheet.getCell('C9'));
                        const shippedVia = functions.getTextFromCell(
                            worksheet.getCell('E9'),
                        );
                        const FeeOnBoard = functions.getTextFromCell(
                            worksheet.getCell('H9'),
                        );
                        const termsOfService = functions.getTextFromCell(
                            worksheet.getCell('J9'),
                        );
                        const data = [];
                        let rowIndex = 11;

                        // eslint-disable-next-line no-constant-condition
                        while (true) {
                            const row = worksheet.getRow(rowIndex);
                            const cellValue = row.getCell('A').value;

                            // eslint-disable-next-line max-depth
                            if (cellValue === 'APPROVED BY') {
                                break;
                            }

                            const rowData = [];
                            // eslint-disable-next-line max-depth
                            for (let colIndex = 1; colIndex <= 9; colIndex++) {
                                rowData.push(functions.getTextFromCell(row.getCell(colIndex)));
                            }
                            data.push(rowData);
                            rowIndex++;
                        }

                        let salesPercentageTax;
                        worksheet.eachRow((row, rowNumber) => {
                            const columnHValue = row.getCell('H').value;

                            if (columnHValue === 'Sales Tax (%)') {
                                salesPercentageTax = row.getCell('I').value;
                                return false; // Stop iterating through rows
                            }
                            return true;
                        });
                        const cleanedData = data
                            .filter((row) =>
                                row.some(
                                    (value) =>
                                        value !== '' && value !== null && value !== undefined,
                                ),
                            )
                            .map((row) =>
                                row.filter(
                                    (value, index, self) =>
                                        value !== '' &&
                    value !== undefined &&
                    self.indexOf(value) === index,
                                ),
                            );
                        console.log(cleanedData);

                        const poDetails = cleanedData.map((element) => {
                            return {
                                value: {
                                    unitQuantity: {
                                        type: 'NUMBER',
                                        value: element[0], // Convert to string if needed
                                    },
                                    Description: {
                                        type: 'SINGLE_LINE_TEXT',
                                        value: element[1],
                                    },
                                    unitPrice: {
                                        type: 'NUMBER',
                                        value: element[2], // Convert to string if needed
                                    },
                                    amount: {
                                        type: 'CALC',
                                        value: '',
                                    },
                                },
                            };
                        });
                        console.log(poDetails);
                        newRecords.push({
                            poNumber: {value: poNumber},
                            poDate: {value: poDateString},
                            startDate: {value: startDate},
                            cancelDate: {value: cancelDate},
                            orderedBy: {value: orderBy},
                            shippedVia: {value: shippedVia},
                            FOB: {value: FeeOnBoard},
                            Terms: {value: termsOfService},
                            customerName: {value: customerArray[0]},
                            customerCompanyName: {value: customerArray[1]},
                            customerAddres: {value: customerArray[2] + customerArray[3]},
                            billName: {value: billToArray[0]},
                            billCompanyName: {value: billToArray[1]},
                            billAddress: {value: billToArray[2] + billToArray[3]},
                            deliveryName: {value: deliverToArray[0]},
                            deliveryCompanyName: {value: deliverToArray[1]},
                            deliveryAddress: {value: deliverToArray[2] + deliverToArray[3]},
                            salesTaxPercentage: {value: salesPercentageTax},
                            poDetail: {value: poDetails},
                        });
                    }
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: item.name + ' is not an excel file',
                    });
                }
            }
            console.log(newRecords);
            return newRecords;
        },
        addNewPoRecs: (record) => {
            return poAppClient.record.addRecords({
                app: poApp.id,
                records: record,
            });
        },
        getPoRecords: (poNumber) => {
            return poAppClient.record.getRecords({
                app: poApp.id,
                query: `poNumber in (${poNumber})`
            });
        }
    };
})(
    // eslint-disable-next-line no-undef
    init,
);
