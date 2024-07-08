((
    {
        app,
        lib,
        globalVars
    },
    functions
) => {
    const {thisApp} = app;
    const Swal = lib.Swal;
    kintone.events.on(thisApp.event.createEditShow(), e => {


        return e;
    });

    kintone.events.on(thisApp.event.detailShow(), async e => {

        const record = e.record;
        const allAssigneeList = await functions.getAllAssignee(120000);

        // Create a button
        const mySpaceFieldButton = document.createElement('button');
        mySpaceFieldButton.id = 'space_for_button';
        mySpaceFieldButton.innerHTML = 'Suggest Assignee';
        mySpaceFieldButton.className = 'myButton';

        // Run a code when the button is clicked
        mySpaceFieldButton.onclick = async function() {
            // Use SweetAlert2 to create the initial modal with dropdown option
            Swal.fire({
                title: `Best Candidate For This PO Is`,
                html:
                `<div style = font-size:50px;>${allAssigneeList.bestSuggestion.bestName}</div>` +
                `<table class="info-table">
                <tr>
                    <td class="label">Current Workload</td>
                    <td class="value">${allAssigneeList.bestSuggestion.bestWorkload}</td>
                </tr>
                <tr>
                    <td class="label">Expertise Score</td>
                    <td class="value">${allAssigneeList.bestSuggestion.bestExpScore}</td>
                </tr>
                <tr>
                    <td class="label">Past Performance</td>
                    <td class="value">${allAssigneeList.bestSuggestion.bestPastPerformance}</td>
                </tr>
                </table>`,
                icon: 'info',
                showCancelButton: true,
                confirmButtonText: 'OK',
                cancelButtonText: 'Input Manual',
                showCloseButton: true,
                cancelButtonColor: '#d33',
                allowOutsideClick: false
            }).then(async (result) => {
                if (result.value) {
                // Handle OK action here
                    await functions.updateRecordAssignee(allAssigneeList.assigneeId, record);
                    await functions.updateStatus(record);
                    await functions.updateWorkload(record, 1);
                    Swal.fire('Successfully Assigneed', '', 'success').then((resp) => {
                        if (resp.value) {
                            location.reload(); // Reload the page
                        }
                    });

                } else if (result.dismiss === Swal.DismissReason.cancel) {
                // Cancel button clicked
                    let selectOptions = '';
                    allAssigneeList.manualInputStore.forEach(item => {
                        selectOptions += `<option value="${item.name}">${item.name}</option>`;
                    });

                    Swal.fire({
                        title: 'Select Your Sales Assignee',
                        html:
                          '<select id="swal-select" class="swal2-select">' +
                          `<option disabled selected style="color: grey;" value="Choose An Option">Choose An Option</option>` +
                          selectOptions +
                          '</select>' +
                          `<h3></h3>` +
                            `<div class = swal-input-label>
                            <label for="swal-input4" class="swal2-label">Assigne ID</label>
                            <input id="swal-input4" class="swal2-input" placeholder="ID" readonly>
                            </div>` +
                            `<div class = swal-input-label>
                            <label for="swal-input3" class="swal2-label">Current Workload</label>
                            <input id="swal-input3" class="swal2-input" placeholder="Workload" readonly>
                            </div>` +
                            `<div class = swal-input-label>
                            <label for="swal-input1" class="swal2-label">Expertise Score:</label>
                            <input id="swal-input1" class="swal2-input" placeholder="expScore" readonly>
                            </div>` +
                            `<div class = swal-input-label>
                            <label for="swal-input2" class="swal2-label">Past Performance:</label>
                            <input id="swal-input2" class="swal2-input" placeholder="pastPerformance" readonly>
                            </div>`,
                        focusConfirm: false,
                        showCancelButton: true,
                        cancelButtonText: 'Cancel',
                        onOpen: () => {
                            const select = document.getElementById('swal-select');
                            const input1 = document.getElementById('swal-input1');
                            const input2 = document.getElementById('swal-input2');
                            const input3 = document.getElementById('swal-input3');
                            const input4 = document.getElementById('swal-input4');

                            select.addEventListener('change', () => {
                                // Find the selected item from data
                                const selectedItem = allAssigneeList.manualInputStore.find(item => item.name === select.value);
                                if (selectedItem) {
                                    input1.value = selectedItem.expScore;
                                    input2.value = selectedItem.pastPerformance;
                                    input3.value = selectedItem.workLoad + ' P.O';
                                    input4.value = selectedItem.assigneeId;
                                } else {
                                    input1.value = '';
                                    input2.value = '';
                                    input3.value = '';
                                    input4.value = '';
                                }
                            });
                        },
                        preConfirm: () => {
                            return {
                                selectValue: document.getElementById('swal-select').value,
                                inputValue1: document.getElementById('swal-input1').value,
                                inputValue2: document.getElementById('swal-input2').value,
                                inputValue3: document.getElementById('swal-input3').value,
                                inputValue4: document.getElementById('swal-input4').value
                            };
                        }
                    }).then(async (resp) => {

                        if (resp.value) {
                            await functions.updateRecordAssignee(resp.value.inputValue4, record);
                            await functions.updateStatus(record);
                            await functions.updateWorkload(record, 1);
                            Swal.fire('Successfully Assigneed', '', 'success').then((response) => {
                                if (response.value) {
                                    location.reload(); // Reload the page
                                }
                            });
                        }
                    });
                }
            });
        };
        // Set button on the Blank space field
        if (e.record.Status.value === 'Not started') {
            kintone.app.record.getHeaderMenuSpaceElement('space_for_button').appendChild(mySpaceFieldButton);
        }
        return e;
    });

    kintone.events.on(thisApp.event.processProceed(), e => {
        const record = e.record;
        const nextStatus = e.nextStatus.value;
        const currDate = new Date();
        const actualDate = functions.formatDate(currDate);
        const deadline = record.resolvedDeadline.value;
        const deadlineResolved = new Date(deadline);
        let currentScore = parseInt(record.Performance.value, 10);
        const poReceived = record.poReceivedAssignee.value;
        const poReceivedDate = new Date(poReceived);
        switch (nextStatus) {
        case 'In Progress':

            record.inProgActual.value = actualDate;
            break;
        case 'Awaiting Shipment':

            record.awaitingShipmentActual.value = actualDate;
            break;
        case 'Shipped':
            record.resolvedActual.value = actualDate;
            if (currDate > deadlineResolved) {
                currentScore -= 1;
            } else {
                currentScore += 1;
            }
            console.log(poReceivedDate);
            if (poReceivedDate) {
                const businessDays = functions.calculateBusinessDays(poReceivedDate, currDate);
                console.log(businessDays);
                record.daysTaken.value = businessDays.toString();
            }

            functions.updateWorkload(record, -1);
            functions.getPerformanceAndUpdate(record, currentScore);
            break;
        }
        return e;
    });
})(
    // eslint-disable-next-line no-undef
    init,
    // eslint-disable-next-line no-undef
    functions
);
