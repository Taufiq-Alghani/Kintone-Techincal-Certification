/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const init = {
    app: {
        thisApp: {
            id: kintone.mobile.app.getId(),
            token: 'RdV0xuPgWlK18hggs1PVGmdgOwTZ8vnDBrzUnsmt',
            fieldCode: {
                status: 'Status',
                assignee: 'Assignee',
                updatedDatetime: 'Updated_datetime',
                createdDatetime: 'Created_datetime',
                categories: 'Categories',
                purchaseOrderFile: 'excelAttachment',
                recordNumber: 'Record_number',
                createdBy: 'Created_by',
                receivedDate: 'receivedDate',
                updatedBy: 'Updated_by',
            },
            event: {
                indexShow: () => ['mobile.app.record.index.show'],
                createEditShow: () => [
                    'mobile.app.record.create.show',
                    'mobile.app.record.edit.show',
                ],
                detailShow: () => [`mobile.app.record.detail.show`],
                submit: () => [`mobile.app.record.create.submit`, `mobile.app.record.edit.submit`],
                submitSuccess: () => [
                    `mobile.app.record.create.submit.success`,
                    `mobile.app.record.edit.submit.success`,
                ],
                exportExcel: () => [`mobile.app.record.detail.process.proceed`],
            },
        },
        // Please Change this id with actual app id first
        poApp: {
            id: 9,
            token: 'sCyFvilqDUOUH9fVZa4xcFEyc9WdJDpPoFKVeDVc',
        },
    },
    lib: {
        client: (apiToken) => {
            const opt = apiToken
                ? {
                    auth: {
                        apiToken,
                    },
                }
                : {};

            return new KintoneRestAPIClient(opt);
        },
        Swal,
        Kuc: Kuc,
        dt: luxon.DateTime,
    },
    globalVars: {},
};
