# 6 Runtime View {#section-runtime-view}

This section describes important runtime scenarios of the system, illustrating how key interactions happen step-by-step.

## 6.1 Authentication Flow

This scenario covers the process of a user logging into the system, obtaining authentication tokens, and establishing a session.

![Authentication Flow Sequence Diagram](./images/authentication-flow-sequence.png)

## 6.2 Material Delta Tracking

This scenario shows how site workers or managers track material deliveries or consumption on a construction site, including updates to the backend and notifications if needed.

![Material Delta Sequence Diagram](./images/material-delta-sequence.png)

## 6.3 Creating User with Email and Scope Checks

This scenario demonstrates how a Construction Manager creates a new user, triggering email invitations via Mailgun and applying role-based access controls.

![User Creation Sequence Diagram](./images/user-creation-sequence.png)
