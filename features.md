# Store application modules and features

## Databases

1. MongoDB
2. PostgreSQL

## Apps

1. Store (Website)
2. Panel (Admin)
3. Vendor (Seller)

## Features

1. Authentication
2. User
3. Profile
4. Address
5. Wallet
6. Roles
7. Permissions
8. Storage (File Uploader)
9. File Manager (Manage uploaded files)
10. SMS
11. Email
12. Category
13. Blog
14. blog Comment
15. Author
16. Shop
17. Product
18. Product Features
19. Product QA
20. Product Review and Rating
21. Basket
22. Order
23. Discount
24. Payment
25. Logger
26. Activity
27. Notification
28. Ticket
29. Report
30. Session

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

Token Data

    ID
    userId
    deviceInfo
    ipAddress
    refreshTokenHash
    accessTokenHash
    createdAt
    expiresAt
    revoked

Save tokens in postgres
