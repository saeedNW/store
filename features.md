# Store application modules and features

## Databases

1. MongoDB
2. PostgreSQL

## Apps

1. Store (Website)
2. Panel (Admin)
3. shop (Seller)
4. Support (Socket Base Customer Service)

## Features

1. SMS [GENERAL]
2. Email [GENERAL]
3. Logger [GENERAL]
4. Authentication [General]
   1. Send OTP
   2. Verify OTP
   3. Login
   4. Reset Password
   5. Refresh Token
   6. Logout
   7. Active Sessions
   8. Revoke Token
   9. Revoke All Tokens Except Current
5. User
   1. User [PANEL]
      1. Create user
      2. Get User full Information
      3. Update user information
         1. Password
         2. Phone Number
      4. Update user role
   2. Account [STORE]
      1. Get Account Information
      2. Update Phone Number
      3. Update Password
6. Profile
   1. [PANEL]
      1. Get user Profile Information
      2. Update Profile Information
      3. Update Profile Picture
      4. Remove Profile Picture
   2. [STORE]
      1. Get Profile Information
      2. Update Profile Information
      3. Update Email Address
      4. Update Profile Picture
      5. Remove Profile Picture
7. Address
   1. [PANEL]
      1. Get User Address List
      2. Get Single Address
      3. Create Address
      4. Update Address
      5. Delete Address
   2. [STORE]
      1. Get All Address
      2. Get Single Address
      3. Create Address
      4. Update Address
      5. Delete Address
      6. Set Default Address
8. Permissions [PANEL]
   1. Get Permissions List
9. Roles [PANEL]
   1. Get Roles List
   2. Get Single Role
   3. Create Role
   4. Update Role
   5. Delete Role
10. Wallet
11. Storage (File Uploader)
12. File Manager (Manage uploaded files)
13. Category
14. Blog
15. blog Comment
16. Author
17. Shop
18. Shop Staff
19. Product
20. Product Features
21. Product QA
22. Product Review and Rating
23. Basket
24. Order
25. Discount
26. Payment
27. Audit
28. Notification
29. Ticket
30. Report

## Features by Database

1. PostgreSQL
   1. Authentication
   2. User
   3. Profile
   4. Address
   5. Wallet
   6. Roles
   7. Permissions
   8. Category
   9. Shop
   10. Product
   11. Product Features
   12. Product QA
   13. Product Review and Rating
   14. Basket
   15. Order
   16. Discount
   17. Payment
   18. Ticket
2. MongoDB
   1. File Manager
   2. Blog
   3. blog Comment
   4. Author
   5. Activity
   6. Notifications

## Token

Access token => 15–30 minutes
Refresh token => 7–15 days
