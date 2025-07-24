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
6. Send OTP
7. Verify OTP
8. Login
9. Reset Password
10. Refresh Token
11. Logout
12. Active Sessions
13. Revoke Token
14. Revoke All Tokens Except Current
15. Account [GENERAL] - **DONE**
16. Get Account Information
17. Update Phone Number
18. Update Password
19. Profile
20. [PANEL]
    1. Get user Profile Information
    2. Update Profile Information
    3. Update Profile Picture
    4. Remove Profile Picture
21. [STORE]
    1. Create Profile
    2. Get Profile Information
    3. Update Profile Information
    4. Update Email Address
    5. Update Profile Picture
    6. Remove Profile Picture
22. Address
23. [PANEL]
    1. Get User Address List
    2. Get Single Address
    3. Create Address
    4. Update Address
    5. Delete Address
24. [STORE]
    1. Get All Address
    2. Get Single Address
    3. Create Address
    4. Update Address
    5. Delete Address
    6. Set Default Address
25. User [PANEL]
26. Create user
27. Get User full Information [Account + Profile]
28. Update user information
    1. Password
    2. Phone Number
29. Update user role
30. Make user the shop staff
31. Permissions
32. [PANEL]
    1. Get Permissions List
33. [SHOP]
    1. Get Shop Permissions list
34. Roles
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
35. Wallet
36. Gallery
37. Category
38. Blog
39. blog Comment
40. Author
41. Shop
    1. [PANEL]
       1. Get Shop List
       2. Get Single Shop
       3. Create Shop
          1. Verify The Shop Creation Request
       4. Update Shop
       5. Delete Shop
       6. Change Shop Owner
       7. Change Shop Status [Active, Inactive]
    2. [STORE]
       1. Get Shop List
       2. Get Single Shop
       3. Send Shop Creation Request
    3. [SHOP]
       1. Get Shop Information
       2. Update Shop Information
          1. Update Shop Logo
          2. Remove Shop Logo
          3. Update Shop Description
          4. Update Shop Address
42. Shop Staff
    1. [PANEL]
       1. Get Shop Staff List
       2. Get Single Shop Staff
    2. [SHOP]
       1. Get Shop Staff List
       2. Get Single Shop Staff
       3. Update Shop Staff role
       4. Delete Shop Staff
43. Product
44. Product Features
45. Product QA
46. Product Review and Rating
47. Basket
48. Order
49. Discount
50. Payment
51. Audit
52. Revision
53. Notification
54. Ticket
55. Report

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
