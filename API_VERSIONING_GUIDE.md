# 📝 API Versioning Guide – NestJS Store Backend

This document describes the **API versioning strategy** implemented across all applications in the **NestJS Store Backend**. It provides guidelines for managing versions, introducing new endpoints, and maintaining backward compatibility.

---

## 1️⃣ Overview

The NestJS Store Backend uses **URI-based API versioning**, allowing multiple API versions to coexist. All endpoints follow the pattern:

```txt
/api/v{version}/{resource}
```

**Goals:**

- Ensure backward compatibility for existing clients
- Allow safe introduction of new features in future versions
- Maintain a clear and consistent versioning strategy across Store, Shop, and Panel applications

---

## 2️⃣ Versioning Configuration

Versioning is enabled in each application’s main entry point:

```typescript
app.enableVersioning({
  type: VersioningType.URI,
  defaultVersion: '1',
});
```

**Key Points:**

- Uses **URI-based versioning** (`/v1`, `/v2`, …)
- Default version is `v1` for all apps
- Supports easy addition of new versions without breaking existing clients

---

## 3️⃣ Versioning Approach

### 3.1 URI-Based Versioning

- Every resource path includes the version as a prefix: `/api/v1/resource`
- Versioning is **per-controller**, allowing different controllers for each version
- Allows **parallel maintenance** of multiple versions

### 3.2 Controller Strategy

- Create **separate controllers per version** if endpoints change significantly
- Controllers can include **v1-only**, **v2-only**, or overlapping endpoints
- Future enhancements or new features are added in newer version controllers

### 3.3 Module Registration

- Versioned controllers are registered alongside previous versions in the module
- No changes are required for shared services; business logic can be reused

---

## 4️⃣ Adding a New API Version

**Steps:**

1. **Create a new versioned controller**

   - Specify the version in the controller decorator:

   ```typescript
   @Controller({ path: 'resource', version: '2' })
   ```

2. **Add v2-specific logic**

   - Modify behavior, responses, or add new fields
   - Optionally add entirely new endpoints exclusive to v2

3. **Register controller in the module**

   - Include both v1 and v2 controllers in the module’s `controllers` array
   - Services can remain shared unless version-specific logic is required

4. **Update documentation**

   - Update internal Swagger for the new version
   - Tag endpoints clearly with version identifiers

---

## 5️⃣ Migration Strategy

**For existing endpoints (v1):**

- Clients must update requests to include `/v1` prefix
- No automatic backward compatibility is maintained if endpoints are changed
- Front-end development team can access a **single Swagger doc** with all versions for reference

**For new versions (v2, v3, …):**

- Develop new controllers alongside existing versions
- Clients can gradually migrate to the latest version
- Deprecated versions can be phased out with proper communication and notices

---

## 6️⃣ Benefits of This Approach

1. **Backward Compatibility** – Existing clients continue working while new features are introduced.
2. **Safe Experimentation** – v2+ endpoints allow testing without affecting v1.
3. **Gradual Migration** – Clients can migrate incrementally to newer versions.
4. **Long-Term Maintainability** – Clear separation between versions reduces risk of breaking changes.
5. **Internal Swagger Support** – A single internal documentation instance can show all versions for development purposes, allowing filtering by version tags.

---

## 7️⃣ Documentation & Developer Guidelines

- **Swagger / OpenAPI:**

  - Use version tags (`v1`, `v2`, …) for each controller
  - Maintain a **single internal Swagger UI** with version filters for the front-end team

- **Deprecation Notices:**

  - Mark endpoints with `@ApiOperation({deprecated: true })` to indicate upcoming removals
  - Provide migration instructions internally

- **Consistent Versioning:**

  - Always increment the version number for breaking changes
  - Non-breaking enhancements can optionally remain in the current version

---

## 8️⃣ Best Practices

- Keep **business logic reusable** across versions when possible
- Minimize changes to v1 to avoid breaking existing clients
- Plan v2+ endpoints around **enhancements, new features, or optimized responses**
- Maintain **clear documentation for each version** to reduce confusion
- Use version prefixes consistently across all applications: **Store, Shop, Panel**

---

This strategy ensures a **robust, maintainable, and scalable API versioning system**, keeping the NestJS Store Backend flexible for future growth while minimizing disruption to front-end development.
