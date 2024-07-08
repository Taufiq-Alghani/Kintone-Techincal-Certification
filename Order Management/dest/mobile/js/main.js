(({app, lib, globalVars}, functions) => {
    const {thisApp} = app;
    const Swal = lib.Swal;

    kintone.events.on(thisApp.event.exportExcel(), async (e) => {
        const record = e.record;
        const excelData = await functions.downloadExcelFile(record);
        console.log(excelData);
        const poNumberArr = [];
        excelData.forEach(element => {
            poNumberArr.push(element.poNumber.value);
        });
        console.log(poNumberArr);
        const poNumberStr = '"' + poNumberArr.join('","') + '"';
        console.log(poNumberStr);
        const purchaseOrderRecs = await functions.getPoRecords(poNumberStr);
        console.log(purchaseOrderRecs);
        const duplicatePoNumber = [];
        if (purchaseOrderRecs.records.length > 0) {
            purchaseOrderRecs.records.forEach((element) => {
                duplicatePoNumber.push(element.poNumber.value);
            });
            console.log(duplicatePoNumber);
            const confirmDestroyed = await Swal.fire({
                title: 'There Is Duplicated Po Number',
                text: 'Do You Still Want To Post Excluding Duplicate?',
                icon: 'question',
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Cancel'
            });
            console.log(confirmDestroyed);
            if (confirmDestroyed.value) {
                const filteredDataArray = excelData.filter(item => !duplicatePoNumber.includes(item.poNumber.value.toString()));
                console.log(filteredDataArray);
                const addnewRecs = await functions.addNewPoRecs(filteredDataArray);
                console.log(addnewRecs);
            } else if (confirmDestroyed.dismiss) {
                return false;
            }

        } else {
            const addnewRecs = await functions.addNewPoRecs(excelData);
            console.log(addnewRecs);
            if (addnewRecs.records.length > 0) {
                return e;
            }
        }
        return e;
    });
})(
    // eslint-disable-next-line no-undef
    init,
    // eslint-disable-next-line no-undef
    functions,
);
