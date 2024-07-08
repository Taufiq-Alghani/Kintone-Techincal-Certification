# Customer Order Management System With Kintone Document

**Title**: Order Management System & Auto Suggestion Assignee Purchas Order With Kintone

## Introduction

**Purpose**:
This document outlines the specifications for a Customer Order Management System & Auto Suggestion Assignee Purchas Order designed to convert Excel files into purchase order records and efficiently manage the workflow of these orders.

**Scope**:
This document encompasses the requirements for converting customer order Excel spreadsheets into purchase order records within Kintone, updating purchase order statuses, implementing intelligent auto-recommend assignee based on expertise and workload, automatically calculating process date deadlines, displaying performance measurement charts, and ensuring timely completion with deadline reminder notifications.

---

## Overall Description

**Product Perspective**:
The Customer Order Management System consists of the Order Management App, Purchase Order App, and Purchasing Department App. These apps are integrated to streamline the entire order processing workflow.

**Product Functions**:

- Convert and read customer order Excel spreadsheets into purchase order records.
- Update purchase order statuses with intelligent assignee recommendation based on workload and expertise.
- Automatically calculate each process deadline, intelligently excluding weekends.
- Send reminders for approaching deadlines to assignees.

**User Characteristics**:

- Kintone users, employees, or salespersons with access to the Order Management.
- Members of the purchasing department with access to the Purchase Order App.

**Assumptions and Dependencies**:

- Excel files follow a specific order format.
- Each customer order has a unique PO number and cannot be duplicated.
- Users have the necessary permissions in Kintone.

---

## Specific Requirements

**Functional Requirements**:

1. **Convert Customer Order Excel Files to Purchase Order Records**:

   - Multiple Excel attachments can be uploaded.
   - Each attachment generates a new record in the Purchase Order App when the upload button is pressed on the detail page.
   - Fields in the Purchase Order App are populated based on the Excel data.
   - Validation ensures attachments are in the predetermined format and do not duplicate existing PO numbers.

   **How To Use**

   - Create Record that contains excel file that want to be imported
   - After creating record then click the convert button at proccess management feature on kintone
   - After succesfully proccess management convert is finished then the excel data will be created on Purchase Order app

   ![ProccessManagementButton](images/Proccess%20Management.png)

   **Limitation**

   - Cannot convert excel attachments that are not same with current purchase order format

2. **Intelligently Recommend Assignee**:

   - Button to assign tasks to the purchasing department member with the least workload, highest expertise and score of their past performance.
   - all the assignee data (current workload, past expertise, and past performance) is stored in Master Assignee app

   ![SuggestionAssignee](images/Proccess%20Management.png)

   - When Button clicked then the best suggestion will appear

   ![SuggestionPopUp](images/Suggestion%20PopUp.png)

   - Users can manually override the auto-assignment by selecting from a dropdown list.

   ![ManualPopUp](images/InputAssignee.png)

   - After succesfully assigned the record then success pop up wil appear
     ![SuccessPopUp](images/Success%20Assignee.png)

3. **Update Purchase Order Status & Auto Calculate Deadline Dates**:

   - Status changes to "PO Received" when the custom assign button is pressed.
   - Automatically calculate deadline dates excluding weekends.
   - PO Received (creation date), In Progress (2 days), Awaiting Shipment (3 days), Resolved (1 day).
   - Update dates and days spent between processes as they advance.
   - Workload of the assignee is adjusted accordingly when processes are resolved.

     ![Auto Deadline](images/autoDeadline.png)

4. **Auto Reminders**:

   - Send reminders at 0 AM the day before the deadline.

5. **Visual Aids**:

   - Displaying Performance Measurement Charts

   ![BarChart](images/barChart.png)
   ![LineChart](images/TimeTaken.png)
   ![PieChart](images/PieChart.png)
   **Non-functional Requirements**:

6. **Performance**:

   - The app should handle up to unlimited users, as per Kintone capabilities.
   - Excel parsing using the ExcelJS library should complete within less than 5 seconds per file.

7. **Usability**:
   - User-friendly interface for uploading and managing files.

---

## Use Cases

**Use Case 1**: Convert and Upload Customer Order Excel Files

- **Actor**: User
- **Description**: User uploads customer order Excel files. After submission, the button to upload the data into the purchase order App record appears on the detail page.
- **Preconditions**: User has logged in and accessed the Order Management App, and the customer order has a unique order number.
- **Postconditions**: New purchase order records are created when the button is pressed.

---

**Use Case 2**: Advance Process Management and Receive Notifications

- **Actor**: Purchasing Department Member
- **Description**: The purchasing department member advances the process management stages. When a process is advanced, the system marks the actual date, calculates the days spent between processes, and notifies the member of upcoming deadlines.
- **Preconditions**: The purchasing department member has been assigned a purchase order record.
- **Postconditions**: The actual date is recorded, the days spent between processes are calculated and updated, and the member receives email notifications one day before the deadline at 8 AM.

---

## System Architecture

**High-Level Design**:

- Client-server architecture using Kintone platform APIs.
- Excel parsing module integrated with Kintone using custom JavaScript code for record creation and status updates.

---

<!-- ### Flowchart

Here is a flowchart illustrating the workflow of the Customer Order Management System:

--- -->

## Constraints

**Software Constraints**:

- The application must run on the Kintone platform.

**Regulatory Requirements**:

- The system must comply with company data protection policies.

---

## Appendices

**Glossary**:

- **Kintone**: A cloud-based platform for building and deploying custom business applications.
- **PO**: Purchase Order

**Related Documents**:

- Kintone API Documentation
