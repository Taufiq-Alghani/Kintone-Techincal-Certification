/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
const init = {
    app: {
        thisApp: {
            id: kintone.mobile.app.getId(),
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
                    'mobile.app.record.index.show'
                ],
                createEditShow: () => [
                    'mobile.app.record.create.show',
                    'mobile.app.record.edit.show',
                ],
                detailShow: () => [
                    `mobile.app.record.detail.show`,
                ],
                submit: () => [
                    `mobile.app.record.create.submit`,
                    `mobile.app.record.edit.submit`,
                ],
                submitSuccess: () => [
                    `mobile.app.record.create.submit.success`,
                    `mobile.app.record.edit.submit.success`,
                ],
                processProceed: () => [
                    `mobile.app.record.detail.process.proceed`
                ]
            },
        },
        // Please Change this id with actual app id first
        masterAssigneeApp: {
            id: 10,
            token: 'thJH8Imvf1LxfigJhUJ6jFg341NYbPp4SyYYmCtl'
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