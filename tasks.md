## Todo

## Store
- [ ] Auth [Store] [id: f4ca8165-f817-4555-9a72-49e4cecb4165] [Priority: Medium]
    - OTP (send/verify)
    - Login / Logout
    - Password Reset
    - Refresh Token
    - Active Session Tracking
    - Token Revocation (single/all except current)
- [ ] Account [Store] [id: 506329c8-87b1-4f41-9b37-66eadfac9c86] [Priority: Medium]
    - Get Account Info
    - Update Phone
    - Update Password
- [ ] Profile [Store] [id: 576b0386-1aa1-46c4-a57a-c4cbaf50d582] [Priority: Medium]
    - Get Profile
    - Update Profile Info
    - Update Email
    - Update Avatar
    - Remove Avatar
- [ ] Address [Store] [id: 3fb44bff-1ac5-405a-a97b-b5b799b2b293] [Priority: Medium]
    - Get Addresses List
    - Get Single Address
    - Create new Address
    - Update Address
    - Remove Address
    - Update Default
- [ ] Wallet [Store] [id: 4dc537fb-3da5-4b45-9a0f-760e2b7dec4a] [Priority: Medium]
    Wallet:
    - Wallet creation upon user creation
    - Get Balance
    - Charge and wallet balance
    - New Withdrawal request
    - Withdrawal history
    - Single withdrawal data
    --------------------------------------
    Cards:
    - Get cards available amount
    --------------------------------------
    Note #1: The used card for each transaction should be saved
    Note #2: user can request withdraw/refund to each card based on the card available amount.
    Note #3: If balance hit 0, all cards available amount change to 0
    Note #4: Users can use wallet assets during payments
- [ ] Basket [Store] [id: 71308b85-bd1e-4e4f-aef6-df0722ca5878] [Priority: Medium]
    - Add product
    - Remove product
    - Update product quantities
- [ ] Order [Store] [id: 9a5e4c4f-3550-4e15-a228-61db4d7467c7] [Priority: Medium]
    - Order placement
    - Order Tracking
- [ ] Discount [Store] [id: 78bf448d-aaa4-4c8f-9f6d-5ab8db47258d] [Priority: Medium]
    - Coupon/Promo code validation
    - Get Coupon/Promo code data
- [ ] Payment [Store] [id: dac1554a-8d71-43fa-8460-10f11507d5b6] [Priority: Medium]
    - Payment creation
    - Payment verification
- [ ] Products [Store] [id: 14614127-992f-41a5-91c9-cfd5b3e3cd41] [Priority: Medium]
    - product browsing
    - Single Product
      - one unified product description
      - all sellers/offers for that product with their prices & delivery options.
    - Product purchase
- [ ] Product Features & Attributes [Store] [id: 24041279-5b1a-4e19-b59b-f8b385bfd155] [Priority: Medium]
    - On product page:
      - Shows available attributes (e.g., dropdowns for Size, Color).
      - Updates price/stock dynamically when variant is selected.
    -----------------------------
    - Example
      - Product: Nike T-Shirt
        - Attributes
          - Size → S, M, L
          - Color → Red, Blue
    - Variants (ProductVariant per offer)
      - Red + M → price $20, stock 10
      - Red + L → price $20, stock 5
      - Blue + M → price $22, stock 8
      - Blue + L → price $22, stock 12
- [ ] Product QA [Store] [id: 36d59ce5-acf3-4894-a8ea-0f29b006ac63] [Priority: Medium]
    - Ask questions on product
- [ ] Product Reviews & Ratings [Store] [id: ca6e8981-3a70-4bd5-9675-d4c724285df3] [Priority: Medium]
    - Add reviews and rating on products
- [ ] Favorites [Store] [id: 8b7e0e89-0513-4035-8a17-c97ecd60da15] [Priority: Medium]
    - Users can add items to wishlists
- [ ] Product comparison [Store] [id: ec490039-79c5-4253-887b-3705d1da289d] [Priority: Medium]
    - Users can compare products from same category
- [ ] Blog/Products Category [Store] [id: 54f02c1e-6f02-48ce-87f0-fa6935e9a8ec] [Priority: Medium]
    - Get categories data as nested

## Panel
- [ ] Auth [Panel] [id: c977c30b-45ac-40b5-8247-3df51bc001de] [Priority: Medium]
    - OTP (send/verify)
    - Login / Logout
    - Password Reset
    - Refresh Token
    - Active Session Tracking
    - Token Revocation (single/all except current)
- [ ] Account [Panel] [id: 7b016612-012f-46ae-84e9-622add4f90f5] [Priority: Medium]
    - Get Account Info
    - Update Phone
    - Update Password
- [ ] Profile [Panel] [id: 7794b04b-e35d-4fdc-ba4e-786a658ecc98] [Priority: Medium]
    - Get Profile
    - Update Profile Info
    - Remove Avatar
- [ ] Address [Panel] [id: 4c7f1260-4c57-4e53-be84-b3c7492c0097] [Priority: Medium]
    - Get Addresses List
    - Get Single Address
    - Create new Address
    - Update Address
    - Remove Address
- [ ] Permissions [Panel] [id: 70776561-5540-4857-b2cf-5c7b5c5ebdd3] [Priority: Medium]
    - Get panel specified permissions list
    - Get shop Specified permissions list
- [ ] Role [Panel] [id: 3fad0e03-5fd5-4f28-ba06-c27128ca3f25] [Priority: Medium]
    Panel:
    - Create new role
    - Get roles list
    - Get single role
    - Update roles
    - Remove roles
    --------------------------------------
    Shop:
    - Create per-shop roles
    - Get per-shop roles list
    - Get single role
    - Update role
    - Remove role
    --------------------------------------
    - Role guard
    --------------------------------------
    Note #1: Roles should be panel and shop specified which means each role should have a field name app that define which app the role belongs too
    Note #2: Shop roles should be shop specified, which meand each shop should have its own specified shop and a shop owner should not have CRUD access to another shop's roles
    Note #3: Operators can login to the application using user entity data but in order to access panel APIs the RBAC will validate data from operator entity
    Note #4: OperatorEntity
    - id
    - userId
    - roleId
    - status (active, suspended, removed)
    - createdAt / updatedAt
    Note #5: Example Flow
    - Login (/auth/login):
      - Uses UserEntity.
      - Returns JWT with userId + allowed apps.
    - Accessing Panel APIs
      - Guard extracts userId from JWT.
      - Step 1: Check UserEntity.allowedApps.includes('panel').
      - Step 2: Check OperatorEntity for (userId).
      - Step 3: Is status active?
      - Step 4: Check role/permissions.
- [ ] Users [Panel] [id: 3fa62342-ac5b-45eb-8301-ef24df4eac78] [Priority: Medium]
    - Create New user
    - Get user full info (Account + profile)
    - Update user account
    - Suspend user account
    - Update user role
    - Assign user as a shop staff
- [ ] Staff [Panel] [id: 4ff008de-d79b-4f2a-926c-887bfb9ab886] [Priority: Medium]
    Staff Request
    - List Pending Staff Requests
    - Get Single Staff Request Detail
    - Approve Staff Request
    - Reject Staff Request
    --------------------------------------
    Shop Staff:
    - List Shop Staff
    - Get Single Shop Staff Detail
    - Update Shop Staff Status
    - Update Shop Staff Role
    --------------------------------------
    Note #1: For rejecting a request admins should provide a reason
    Note #2: Staff Request Entity
    - id
    - shopId
    - userId (candidate staff, from Store app)
    - requestedById (shop owner)
    - status (pending, approved, rejected)
    - reason (nullable, rejection reason)
    - createdAt / updatedAt
    Note #3: ShopStaffEntity (actual membership)
    - id
    - shopId
    - userId
    - roleId (nullable until owner assigns)
    - status (active, suspended, removed)
    - createdAt / updatedAt
- [ ] Wallet [Panel] [id: 07e1c7c9-7c82-450b-a23f-4ebccf97ffb1] [Priority: Medium]
    - Get user wallet balance (Monitor)
    - Suspend wallet usage
    - make adjustments to wallet balannce
    - Withdrawal history
    - Single withdrawal
    - Accept withdrawal
    - Reject withdrawal
    --------------------------------------
    Note #1: During withdrawal acceptance admins can Change the card number which the withdrawn money should deliver to.
    Note #2: In order to reject withdrawal request admins should provide a rejection reason.
- [ ] Order [Panel] [id: 5b4ba085-f654-4326-9cf7-15c4b859a4a1] [Priority: Medium]
    - Oversee all orders
- [ ] Discounts [Panel] [id: b7ed6bd1-ea4c-48f1-adae-0f60fd279713] [Priority: Medium]
    - Oversight discounts
    - Oversight coupon/promo cods
- [ ] Payment [Panel] [id: c45faf5d-682f-48c4-b82a-eb5deceaed17] [Priority: Medium]
    - Multiple gateways
    - Transactions log
    - Payment reports
- [ ] Vendor Settlement & Payouts [Panel] [id: b80be13a-19ae-4764-9556-709ad6a7a677] [Priority: Medium]
    - Commission calculation (percentage/fixed)
    - Vendor payout requests approval
    - Vendor payout requests rejection
    - Payout oversight & fraud checks
- [ ] Shop Management [Panel] [id: 20b2eee7-8341-4b58-af68-13b54b149784] [Priority: Medium]
    - Create new shop
    - Update shop
    - Verify shop creation request
    - Change shop ownership
    - Activate/deactivate shop
- [ ] Products [Panel] [id: 870fb5a9-f269-46d4-a08e-320af3da70ac] [Priority: Medium]
    Product Definition:
    - Defines and manages the global product catalog.
    - Each Product contains canonical info:
      - title, description, brand, model, category
      - attributes/features (RAM, storage, color, etc.)
      - images, gallery, SEO, etc.
    ----------------------------------------
    Product Approval:
    - List Pending Product Requests
    - View Request Details
    - Approve (creates Product + Offer)
    - Reject (requires rejection reason)
    ----------------------------------------
    Note #1: Products will be created by admins from admin panel. This way, Panel controls quality and consistency of product data, while Shop has flexibility to manage their own pricing and stock.
    Note #2: Shops can register new product request
    ----------------------------------------
    // Shop request for a new product
    ProductRequest {
      id: uuid;
      shopId: uuid;         // requesting vendor
      requestedById: uuid;  // user who submitted
      title: string;
      description: string;
      categoryId: uuid;
      brand: string;
      attributes: JSONB;
      images: string[];
      status: 'PENDING' | 'APPROVED' | 'REJECTED';
      rejectionReason?: string;
      createdAt: Date;
      updatedAt: Date;
    }
    // Global catalog (approved products)
    Product {
      id: uuid;
      title: string;
      description: string;
      categoryId: uuid;
      brand: string;
      attributes: JSONB;
      images: string[];
      createdByAdminId: uuid;
      createdAt: Date;
      ...
    }
    // Vendor’s specific offer
    ProductOffer {
      id: uuid;
      productId: uuid; // FK to Product
      shopId: uuid;    // FK to Shop
      price: number;
      stock: number;
      sku: string;
      warranty?: string;
      shippingOptions: JSONB;
      createdAt: Date;
      updatedAt: Date;
    }
- [ ] Inventory & Stock Management [Panel] [id: d26a7807-b06d-4a92-af5b-d662d4afb851] [Priority: Medium]
    - Define catalog (no stock).
    - Monitor global stock trends (optional).
    - Analytics: low-stock vendors, top-sellers.
- [ ] Product Features & Attributes [Panel] [id: b06dbd7a-1c54-498b-8893-4281ba3309a8] [Priority: Medium]
    - Define global attributes/features.
    - Can set allowed values (e.g., Color → Red, Blue, Green).
    - Manage which attributes apply to which product categories.
    ----------------------------------------------
    // Global attribute definitions (Panel defines)
    ProductAttribute {
      id: uuid;
      name: string;           // e.g. "Color"
      type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select';
      allowedValues?: string[]; // optional, for select/multi-select
      createdByAdminId: uuid;
    }
    // Mapping attributes to a product (Panel or Shop)
    ProductAttributeValue {
      id: uuid;
      productId: uuid;        // FK → Product
      attributeId: uuid;      // FK → ProductAttribute
      value: string;          // e.g. "Red"
      createdBy: 'ADMIN' | 'SHOP';
    }
    // Variants (per ProductOffer in Shop)
    ProductVariant {
      id: uuid;
      offerId: uuid;          // FK → ProductOffer
      sku: string;
      attributes: JSONB;      // { "Color": "Red", "Size": "M" }
      price: number;
      stock: number;
      images: string[];
    }
    -----------------------------
    - Example
      - Product: Nike T-Shirt
        - Attributes
          - Size → S, M, L
          - Color → Red, Blue
    - Variants (ProductVariant per offer)
      - Red + M → price $20, stock 10
      - Red + L → price $20, stock 5
      - Blue + M → price $22, stock 8
      - Blue + L → price $22, stock 12
- [ ] Product QA [Panel] [id: 7aba5f25-7140-4580-af96-7c0e446d3558] [Priority: Medium]
    - Modarate the QA section
- [ ] Product Reviews & Ratings [Panel] [id: 98afcd4d-7a24-4ca0-b52e-6d99fbafd9e3] [Priority: Medium]
    - Oversee moderation
    - Review approval
    - Review rejection
- [ ] Blog/Products Category [Panel] [id: d8cbe2ba-a33a-490c-912c-5ca5b3803fd9] [Priority: Medium]
    - Create categories
    - get categories list
    - Get single category
    - Update categories
    - Remove categories
    --------------------------------
    Note #1: Categories are shared between blogs and products
    Note #2: Categories can be nested

## Shop
- [ ] Auth [Shop] [id: 670dfa37-0944-4260-8a93-68d80e14875a] [Priority: Medium]
    - OTP (send/verify)
    - Login / Logout
    - Password Reset
    - Refresh Token
    - Active Session Tracking
    - Token Revocation (single/all except current)
- [ ] Account [Shop] [id: eef9a5fa-3db9-4dcf-a917-a11af8a89746] [Priority: Medium]
    - Get Account Info
    - Update Phone
    - Update Password
- [ ] Role [Shop] [id: 7542087e-db54-4e2a-861f-811ac7b20b8b] [Priority: Medium]
    - Create new role for shop
    - Get shop roles list
    - Get single role
    --------------------------------------
    - Role guard
    --------------------------------------
    Note #1: Roles should be panel and shop specified which means each role should have a field name app that define which app the role belongs too
    Note #2: Shop roles should be shop specified, which meand each shop should have its own specified shop and a shop owner should not have CRUD access to another shop's roles
    Note #3: Each shop should have these default roles (Owner, Manager, Support, Fulfillment) and shop owner be able to create additional custom roles if needed
    Note #4: Shop staff can login to the application using user entity data but in order to access Shop APIs the RBAC will validate data from shop staff entity
    Note #5: ShopStaffEntity
    - id
    - shopId
    - userId
    - roleId (nullable until owner assigns)
    - status (active, suspended, removed)
    - createdAt / updatedAt
    Note #6: Example Flow
    - Login (/auth/login):
      - Uses UserEntity.
      - Returns JWT with userId + allowed apps.
    - Request to Shop API (/shops/:shopId/products):
      - Guard extracts userId from JWT.
      - Step 1: Check UserEntity.allowedApps.includes('shop').
      - Step 2: Check ShopStaffEntity for (shopId, userId).
      - Step 3: Check role/permissions.
- [ ] Permissions [Shop] [id: 0ba58383-afa4-4e6a-bb4f-c5f16add3f07] [Priority: Medium]
    - Get shop specified permissions list
- [ ] Staff [Shop] [id: ca4ef777-583f-4d0b-9250-4d8ae620b08d] [Priority: Medium]
    - Get staff list
    - Register new staff
    - Get single staff full account info (Account + profile)
    - Update staff role for the shop
    - Remove staff
    - Suspend staff access to shop
    --------------------------------------
    Note #1: In order to register new staff to shop the staff should create an account in the store application and then the shop owner can register new staff request using the user's phone number and after admins approval the user will be assign as the shop's staff with no roles.
    Note #2: Staff Request Entity
    - id
    - shopId
    - userId (candidate staff, from Store app)
    - requestedById (shop owner)
    - status (pending, approved, rejected)
    - reason (nullable, rejection reason)
    - createdAt / updatedAt
    Note #3: ShopStaffEntity (actual membership)
    - id
    - shopId
    - userId
    - roleId (nullable until owner assigns)
    - status (active, suspended, removed)
    - createdAt / updatedAt
- [ ] Order [Shop] [id: d9a46287-6ef1-45ce-b27c-536f684b31e1] [Priority: Medium]
    - Manage Incoming orders
- [ ] Discounts [Shop] [id: cd3ff8fd-5e58-46f5-bdf9-fda04744b1f8] [Priority: Medium]
    - Coupon/Promo code system (Shop specified)
    - Shop-level discounts (All products)
    - Product-level discount
- [ ] Payment [Shop] [id: 8e19cbdf-977a-4cd4-aa90-0085bd66b54d] [Priority: Medium]
    + Settelment report
- [ ] Shop Management [Shop] [id: b7236ebb-0a49-4519-bea1-b730f15490e9] [Priority: Medium]
    - Register shop creation request
    - Update shop ditails
    - Update shop logo
- [ ] Vendor payout requests & approvals [Shop] [id: 3ced777c-6a6f-4510-bdc5-959db1573a99] [Priority: Medium]
    - Commission calculation (percentage/fixed)
    - Settlement cycles (weekly/monthly/on-demand)
    - Vendor payout requests
- [ ] Products [Shop] [id: 3a2b9197-c4f1-438b-a470-46d502ed65e5] [Priority: Medium]
    - Selects a product from the catalog.
    - Creates a ProductOffer (their own listing for that product).
    - Submit New Product Request
    - Track Request Status (Pending / Approved / Rejected)
    - Resubmit Rejected Requests (with corrections)
- [ ] Inventory & Stock Management [Shop] [id: fb563763-c298-4942-bd1b-a292663e7f92] [Priority: Medium]
    - Add/adjust stock for their offers.
    - Receive low-stock alerts.
    - View inventory history & movements.
    - Manage reserved/available stock.
- [ ] Product Features & Attributes [Shop] [id: 5ea5e26c-ed62-44b7-bd38-1a47bfa061c0] [Priority: Medium]
    - When creating a product offer:
      - Choose applicable attributes.
      - Fill in attribute values.
      - Optionally define variants with their own stock/price/SKU.
    ----------------------------------------------
    // Global attribute definitions (Panel defines)
    ProductAttribute {
      id: uuid;
      name: string;           // e.g. "Color"
      type: 'text' | 'number' | 'boolean' | 'select' | 'multi-select';
      allowedValues?: string[]; // optional, for select/multi-select
      createdByAdminId: uuid;
    }
    // Mapping attributes to a product (Panel or Shop)
    ProductAttributeValue {
      id: uuid;
      productId: uuid;        // FK → Product
      attributeId: uuid;      // FK → ProductAttribute
      value: string;          // e.g. "Red"
      createdBy: 'ADMIN' | 'SHOP';
    }
    // Variants (per ProductOffer in Shop)
    ProductVariant {
      id: uuid;
      offerId: uuid;          // FK → ProductOffer
      sku: string;
      attributes: JSONB;      // { "Color": "Red", "Size": "M" }
      price: number;
      stock: number;
      images: string[];
    }
    -----------------------------
    - Example
      - Product: Nike T-Shirt
        - Attributes
          - Size → S, M, L
          - Color → Red, Blue
    - Variants (ProductVariant per offer)
      - Red + M → price $20, stock 10
      - Red + L → price $20, stock 5
      - Blue + M → price $22, stock 8
      - Blue + L → price $22, stock 12
- [ ] Product QA [Shop] [id: 5eeca572-cafa-476d-bceb-412668bc4436] [Priority: Medium]
    - Get list of questions on listed offers
    - Answer questions
- [ ] Blog/Products Category [Shop] [id: 5b198324-e2f3-46d6-86f9-47767d1f9e70] [Priority: Medium]
    - get list of the categories
    - Get single category
    - Create new category
    --------------------------------
    Note #1: Categories are shared between blogs and products
    Note #2: Categories can be nested

## General
- [ ] SMS [General] [id: 9fab3606-8862-4263-8f79-1ae245ac2d62] [Priority: Medium]
    - Send OTP
    - Send Notification
- [ ] Legger [General] [id: c341f03a-884f-47c9-905f-f81ced96be7f] [Priority: Medium]
    - Centralized logging for all apps (Store, Shop, Panel)
    - Log levels: DEBUG, INFO, WARN, ERROR
    - JSON formatting for easy ingestion into log aggregation tools
    - Logs API requests, response status, duration, and user context
    - Captures stack traces for exceptions
- [ ] Email [General] [id: b9d4d08b-88ff-47f1-b875-4c39d15464d0] [Priority: Medium]
    - Sent Verification
    - Send Notification
    - Sent adds
    - Etc
- [ ] Storage [General] [id: 50c6db54-2c56-4a6a-9796-03172f4d16d5] [Priority: Medium]
    - Local File Uploader
    - S3 Cloud File Uploader

## Done

