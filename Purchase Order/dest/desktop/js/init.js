/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const init = {
    app: {
        thisApp: {
            id: kintone.app.getId(),
            token: 'sCyFvilqDUOUH9fVZa4xcFEyc9WdJDpPoFKVeDVc',
            fieldCode: {
                'cancelDate': 'cancelDate',
                'companyName': 'customerCompanyName',
                'salesTax': 'Sales_Tax',
                'shippedVia': 'shippedVia',
                'updatedBy': 'Updated_by',
                'createdDatetime': 'Created_datetime',
                'orderedBy': 'orderedBy',
                'address': 'customerAddres',
                'address1': 'deliveryAddress',
                'totalAmount': 'totalAmount_1',
                'purchaseOrderReceivedDate': 'poDate',
                'table': {
                    'purchaseOrderDetails': {
                        'fieldCode': 'poDetail',
                        'columns': {
                            'unitPrice': 'unitPrice',
                            'description': 'Description',
                            'unit': 'unitQuantity',
                            'amount': 'Amount'
                        }
                    }
                },
                'recordNumber': 'Record_number',
                'freeOnBoard': 'FOB',
                'createdBy': 'Created_by',
                'status': 'Status',
                'assignee': 'Assignee',
                'categories': 'Categories',
                'terms': 'Terms',
                'companyName1': 'billCompanyName',
                'customerName': 'customerName',
                'name': 'billName',
                'totalAmount1': 'totalAmount',
                'updatedDatetime': 'Updated_datetime',
                'companyName2': 'deliveryCompanyName',
                'address2': 'billAddress',
                'salesTax0': 'salesTaxPercentage',
                'assignee1': 'assignee',
                'pONumber': 'poNumber',
                'name1': 'deliveryName',
                'startDate': 'startDate'
            },
            event: {
                indexShow: () => [
                    'app.record.index.show'
                ],
                createEditShow: () => [
                    'app.record.create.show',
                    'app.record.edit.show',
                ],
                detailShow: () => [
                    `app.record.detail.show`,
                ],
                submit: () => [
                    `app.record.create.submit`,
                    `app.record.edit.submit`,
                ],
                submitSuccess: () => [
                    `app.record.create.submit.success`,
                    `app.record.edit.submit.success`,
                ],
                processProceed: () => [
                    `app.record.detail.process.proceed`
                ]
            },
        },
        // Please Change this id with actual app id first
        masterAssigneeApp: {
            id: 10,
        }
    },
    lib: {
        client: apiToken => {
            const opt = apiToken ?
                {
                    auth: {
                        apiToken
                    }
                } :
                {};

            return new KintoneRestAPIClient(opt);
        },
        Swal,
        Kuc: Kuc,
        dt: luxon.DateTime,
    },
    globalVars: {
    },
};