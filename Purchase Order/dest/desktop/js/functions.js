const functions = (({app, lib, globalVars}) => {
    const {thisApp, masterAssigneeApp} = app;
    const thisAppClient = lib.client();
    const masterAssigneeClient = lib.client();
    return {
        addBusinessDays: (startDate, day) => {
            const currentDate = new Date(startDate);
            let days = day;
            while (days > 0) {
                currentDate.setDate(currentDate.getDate() + 1);
                // Check if the current day is a weekend
                if (currentDate.getDay() !== 0 && currentDate.getDay() !== 6) {
                    days--;
                }
            }
            return currentDate;
        },
        formatDate: (date) => {
            return date.toISOString().split('T')[0];
        },
        calculateDeadlines: (currentDate) => {
            // Calculate 'in progress' deadline
            const inProgressDate = functions.addBusinessDays(currentDate, 2);

            // Calculate 'awaiting shipment' deadline
            const awaitingShipmentDate = functions.addBusinessDays(inProgressDate, 3);

            // Calculate 'deadline resolved' deadline
            const deadlineResolvedDate = functions.addBusinessDays(awaitingShipmentDate, 1);

            return {
                poReceived: functions.formatDate(currentDate),
                inProgress: functions.formatDate(inProgressDate),
                awaitingShipment: functions.formatDate(awaitingShipmentDate),
                deadlineResolved: functions.formatDate(deadlineResolvedDate)
            };
        },
        updateStatus: async (record) => {
            const recsId = record.$id.value;
            const getThisRecord = await thisAppClient.record.getRecord({
                app: thisApp.id,
                id: recsId,
            });
            const assigneeUser = getThisRecord.record.assignee.value[0].code;
            return thisAppClient.record.updateRecordStatus({
                action: 'P.O Received',
                app: thisApp.id,
                assignee: assigneeUser,
                id: recsId,
            });
        },
        updateRecordAssignee: (suggestion, record) => {
            const recsId = record.$id.value;
            const currDate = new Date();
            const deadlines = functions.calculateDeadlines(currDate);
            return thisAppClient.record.updateRecord({
                app: thisApp.id,
                id: recsId,
                record: {
                    Lookup: {value: suggestion},
                    inProgDeadline: {value: deadlines.inProgress},
                    awaitingShipmentDeadline: {value: deadlines.awaitingShipment},
                    resolvedDeadline: {value: deadlines.deadlineResolved},
                    poReceivedAssignee: {value: deadlines.poReceived}

                },
            });
        },
        getAllAssignee: async (totalProjectValue) => {
            const manualInputStore = [];
            const allAssignee = await thisAppClient.record.getAllRecords({
                app: masterAssigneeApp.id,
            });
            allAssignee.sort((a, b) => {
                // First compare workload
                const workloadDiff = a.workLoad.value - b.workLoad.value;
                if (totalProjectValue >= 100000) {
                    if (workloadDiff === 0) {
                        // If workloads are equal, compare totalScore in descending order
                        return b.totalScore.value - a.totalScore.value;
                    }
                    // If the workload difference is exactly 1, compare expertise score in descending order
                    if (Math.abs(workloadDiff) === 1) {
                        return b.totalScore.value - a.totalScore.value;
                    }
                    // Otherwise, sort by workload in ascending order
                    return workloadDiff;
                }
                if (workloadDiff !== 0) {
                    return workloadDiff;
                }

                // If workloads are equal, compare expertise score (expScore) in descending order
                return b.totalScore.value - a.totalScore.value;

            });
            allAssignee.forEach((element) => {
                manualInputStore.push({
                    name: element.userName.value,
                    workLoad: element.workLoad.value,
                    expScore: element.expScore.value,
                    pastPerformance: element.pastPerformance.value,
                    assigneeId: element.assigneeId.value
                });
            });
            const bestName = allAssignee[0].userName.value;
            const assigneeId = allAssignee[0].assigneeId.value;
            const bestWorkload = allAssignee[0].workLoad.value;
            const bestExpScore = allAssignee[0].expScore.value;
            const bestPastPerformance = allAssignee[0].pastPerformance.value;
            const bestSuggestion = {
                bestName: bestName,
                bestWorkload: bestWorkload,
                bestExpScore: bestExpScore,
                bestPastPerformance: bestPastPerformance
            };
            const anotherSuggestion = [{
                suggestion2: [
                    allAssignee[1].userName.value,
                    allAssignee[1].workLoad.value,
                    allAssignee[1].expScore.value,
                    allAssignee[1].pastPerformance.value],
                suggestion3: [
                    allAssignee[2].userName.value,
                    allAssignee[2].workLoad.value,
                    allAssignee[2].expScore.value,
                    allAssignee[2].pastPerformance.value]
            }];
            console.log(anotherSuggestion);
            return {bestSuggestion, manualInputStore, assigneeId};
        },
        updateSwalField: (name, nameArray) => {
            const selectedPerson = nameArray.find((person) => person.name === name);
            if (selectedPerson) {
                document.getElementById('expScore').value = selectedPerson.expScore;
                document.getElementById('pastPerformance').value =
          selectedPerson.pastPerformance;
            }
        },
        isDateExceeded: (deadline, actual) => {
            const deadlineDate = new Date(deadline);
            const actualDate = new Date(actual);
            return actualDate > deadlineDate;
        },
        getAssigneeRecord: (assigneeId) => {
            return masterAssigneeClient.record.getRecords({
                app: masterAssigneeApp.id,
                query: `assigneeId = "${assigneeId}"`
            });
        },
        getPerformanceAndUpdate: async (record, thisRecordPerformance) => {
            const assigneeLookup = record.Lookup.value;
            const getRecs = await thisAppClient.record.getRecords({
                app: thisApp.id,
                query: `Lookup = "${assigneeLookup}" and Status = "Shipped" order by Updated_datetime desc limit 5`
            });
            const masterAssigneeRecs = await functions.getAssigneeRecord(assigneeLookup);
            let pastPerformanceTotal = 0;
            getRecs.records.forEach(element => {
                const Performance = parseInt(element.Performance.value, 10);
                pastPerformanceTotal += Performance;
            });
            const pastPerformance = (pastPerformanceTotal + thisRecordPerformance) / (getRecs.records.length + 1);
            return thisAppClient.record.updateRecord({
                app: masterAssigneeApp.id,
                id: masterAssigneeRecs.records[0].$id.value,
                record: {
                    'pastPerformance': {value: pastPerformance}
                }

            });
        },
        updateWorkload: async (record, workload) => {
            const recsId = record.$id.value;
            const getThisRecord = await thisAppClient.record.getRecord({
                app: thisApp.id,
                id: recsId,
            });
            const assigneeLookup = getThisRecord.record.Lookup.value;
            const masterAssigneeRecs = await functions.getAssigneeRecord(assigneeLookup);
            const currWorkload = masterAssigneeRecs.records[0].workLoad.value;
            const updWorkload = parseInt(currWorkload, 10) + workload;
            return masterAssigneeClient.record.updateRecord({
                app: masterAssigneeApp.id,
                id: masterAssigneeRecs.records[0].$id.value,
                record: {
                    'workLoad': {value: updWorkload}
                }
            });
        },
        calculateBusinessDays: (startDate, endDate) => {
            let count = 0;
            const curDate = new Date(startDate);

            // eslint-disable-next-line no-unmodified-loop-condition
            while (curDate <= endDate) {
                const dayOfWeek = curDate.getDay();
                if (dayOfWeek !== 0 && dayOfWeek !== 6) { // Skip weekends
                    count++;
                }
                curDate.setDate(curDate.getDate() + 1);
            }
            return count;
        }
    };
})(
    // eslint-disable-next-line no-undef
    init,
);