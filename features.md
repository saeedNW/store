# Store application modules and features

## Databases

1. MongoDB
2. PostgreSQL
3. Redis

## Apps

1. Store (Website)
2. Panel (Admin)
3. shop (Seller)
4. Support (Socket Base Customer Service)

## Features

1. SMS [GENERAL] - **DONE**
2. Email [GENERAL] - **DONE**
3. Logger [GENERAL] - **DONE**
4. Storage (File Uploader) - **DONE**
5. Authentication [GENERAL] - **DONE**
   1. Send OTP
   2. Verify OTP
   3. Login
   4. Reset Password
   5. Refresh Token
   6. Logout
   7. Active Sessions
   8. Revoke Token
   9. Revoke All Tokens Except Current
6. Account [GENERAL] - **DONE**
   1. Get Account Information
   2. Update Phone Number
   3. Update Password
7. Profile - **DONE**
   1. [PANEL] - **DONE**
      1. Get user Profile Information
      2. Update Profile Information
      3. Remove Profile Picture
   2. [STORE] - **DONE**
      1. Create Profile
      2. Get Profile Information
      3. Update Profile Information
      4. Update Email Address
      5. Update Profile Picture
      6. Remove Profile Picture
8. Address
   1. [PANEL]
      1. Get User Address List
      2. Get Single Address
      3. Create Address
      4. Update Address
      5. Delete Address
   2. [STORE] - **DONE**
      1. Get All Address
      2. Get Single Address
      3. Create Address
      4. Update Address
      5. Delete Address
      6. Set Default Address
9. User [PANEL]
   1. Create user
   2. Get User full Information [Account + Profile]
   3. Update user information
      1. Password
      2. Phone Number
   4. Update user role
   5. Make user the shop staff
10. Permissions
    1. [PANEL]
       1. Get Permissions List
    2. [SHOP]
       1. Get Shop Permissions list
11. Roles
    1. [PANEL]
       1. Get Roles List
       2. Get Single Role
       3. Create Role
       4. Update Role
       5. Delete Role
    2. [SHOP]
       1. Get Roles List for the Shop
       2. Get Single Role for the Shop
       3. Create Role for the Shop
       4. Update Shop Role
       5. Delete Shop Role
12. Wallet
13. Gallery
14. Category
15. Blog
16. blog Comment
17. Author
18. Shop
    1. [PANEL]
       1. Get Shop List
       2. Get Single Shop
       3. Create Shop
          1. Verify The Shop Creation Request
       4. Update Shop
       5. Delete Shop
       6. Change Shop Owner
       7. Change Shop Status [Active, Inactive]
    2. [SHOP]
       1. Register Shop
       2. Get Shop Information
       3. Check Registration Status
       4. Update Shop Information
          1. Update Shop Logo
          2. Remove Shop Logo
          3. Update Shop Description
          4. Update Shop Address
          5. Update Shop Activity Time
19. Shop Staff
    1. [PANEL]
       1. Get Shop Staff List
       2. Get Single Shop Staff
    2. [SHOP]
       1. Get Shop Staff List
       2. Get Single Shop Staff
       3. Update Shop Staff role
       4. Delete Shop Staff
20. Product
21. Product Features
22. Product QA
23. Product Review and Rating
24. Basket
25. Order
26. Discount
27. Payment
28. Audit
29. Revision
30. Notification
31. Ticket
32. Report
    1. [PANEL]
       1.
    2. [SHOP]
       1.

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
3. Redis
   1. Authentication
      1. OTP
      2. Token
      3. Session

## Token

### TTL

Access token => 15–30 minutes

Refresh token => 7–15 days

### Add security key to JWT tokens

#### Generate private key

```shell
mkdir -p keys/access
mkdir -p keys/refresh

openssl genpkey -algorithm ed25519 -out keys/access/ed25519_store_private.pem
openssl genpkey -algorithm ed25519 -out keys/access/ed25519_panel_private.pem
openssl genpkey -algorithm ed25519 -out keys/access/ed25519_shop_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_store_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_panel_private.pem
openssl genpkey -algorithm ed25519 -out keys/refresh/ed25519_shop_private.pem
```

#### Generate public key

```shell
openssl pkey -in keys/access/ed25519_store_private.pem -pubout -out keys/access/ed25519_store_public.pem
openssl pkey -in keys/access/ed25519_panel_private.pem -pubout -out keys/access/ed25519_panel_public.pem
openssl pkey -in keys/access/ed25519_shop_private.pem -pubout -out keys/access/ed25519_shop_public.pem
openssl pkey -in keys/refresh/ed25519_store_private.pem -pubout -out keys/refresh/ed25519_store_public.pem
openssl pkey -in keys/refresh/ed25519_panel_private.pem -pubout -out keys/refresh/ed25519_panel_public.pem
openssl pkey -in keys/refresh/ed25519_shop_private.pem -pubout -out keys/refresh/ed25519_shop_public.pem
```

#### Generate Tokens encryption key

Generate 3 different keys for each app and place them in the ENV file.

```shell
openssl rand -base64 32
```

## Application Dockerize

To dockerize the application, create a `Dockerfile` in the project root with the necessary build instructions. Then, use `docker build` to create an image and `docker run` to start a container. Make sure to copy your environment files and configure any required ports or volumes as needed.
