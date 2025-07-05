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
4. Authentication [GENERAL]
   1. Send OTP
   2. Verify OTP
   3. Login
   4. Reset Password
   5. Refresh Token
   6. Logout
   7. Active Sessions
   8. Revoke Token
   9. Revoke All Tokens Except Current
5. Account [GENERAL]
   1. Get Account Information
   2. Update Phone Number
   3. Update Password
6. User [PANEL]
   1. Create user
   2. Get User full Information [Account + Profile]
   3. Update user information
      1. Password
      2. Phone Number
   4. Update user role
7. Profile
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
8. Address
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
9. Permissions
   1. [PANEL]
      1. Get Permissions List
   2. [SHOP]
      1. Get Shop Permissions list
10. Roles
11. [PANEL]
    1. Get Roles List
    2. Get Single Role
    3. Create Role
    4. Update Role
    5. Delete Role
12. [SHOP]
    1. Get Roles List for the Shop
    2. Get Single Role for the Shop
    3. Create Role for the Shop
    4. Update Shop Role
    5. Delete Shop Role
13. Wallet
14. Storage (File Uploader)
15. File Manager (Manage uploaded files)
16. Category
17. Blog
18. blog Comment
19. Author
20. Shop
21. Shop Staff
22. Product
23. Product Features
24. Product QA
25. Product Review and Rating
26. Basket
27. Order
28. Discount
29. Payment
30. Audit
31. Notification
32. Ticket
33. Report

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

### TTL

Access token => 15–30 minutes

Refresh token => 7–15 days

### Add security key to JWT tokens

#### Generate private key

mkdir -p keys/access
mkdir -p keys/refresh

openssl genpkey -algorithm ed25519 -out keys/access/ed25519_store_private.pem
openssl genpkey -algorithm ed25519 -out keys/access/ed25519_panel_private.pem
openssl genpkey -algorithm ed25519 -out keys/access/ed25519_shop_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_store_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_panel_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_shop_private.pem

#### Extract public key

openssl pkey -in keys/access/ed25519_store_private.pem -pubout -out keys/access/ed25519_store_public.pem
openssl pkey -in keys/access/ed25519_panel_private.pem -pubout -out keys/access/ed25519_panel_public.pem
openssl pkey -in keys/access/ed25519_shop_private.pem -pubout -out keys/access/ed25519_shop_public.pem
openssl pkey -in keys/refresh/ed25519_store_private.pem -pubout -out keys/refresh/ed25519_store_public.pem
openssl pkey -in keys/refresh/ed25519_panel_private.pem -pubout -out keys/refresh/ed25519_panel_public.pem
openssl pkey -in keys/refresh/ed25519_shop_private.pem -pubout -out keys/refresh/ed25519_shop_public.pem
