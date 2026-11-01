# Classroom Equipment Tracker

![Java](https://img.shields.io/badge/Java-21-ED8B00?style=flat-square&logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-4.x-6DB33F?style=flat-square&logo=spring-boot)
![React](https://img.shields.io/badge/React-19-61DAFB?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-6-3178C6?style=flat-square&logo=typescript)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15+-4169E1?style=flat-square&logo=postgresql)

## Project Overview

Classroom Equipment Tracker is a full-stack web application for keeping an inventory of classroom equipment. Users can add, edit, delete and search physical assets and track each asset's category, condition and location.

The project demonstrates a layered Spring Boot REST API (controller → service → repository) connected to PostgreSQL, a React + TypeScript frontend, server-side pagination and search, input validation with clear error messages, and unit tests on both the backend and the frontend.

---

## Tech Stack

### Frontend
- **React 19** with hooks for state management
- **TypeScript** for static type checking
- **Vite** as the dev server and build tool
- **Tailwind CSS 4** for styling
- **Lucide React** for icons
- **React Hot Toast** for success and error notifications

### Backend
- **Java 21**
- **Spring Boot 4** (Spring Web MVC, Spring Data JPA, Bean Validation)
- **Hibernate** as the Jakarta Persistence (JPA) implementation
- **PostgreSQL** (hosted on Supabase or run locally)
- **Maven** (via the included Maven Wrapper)

### Testing
- **Backend:** JUnit Jupiter and Mockito
- **Frontend:** Vitest and React Testing Library

---

## Technical Highlights

### Debounced Search

The frontend waits **500 ms** after the last change before calling the API, so typing a word sends one request instead of one per keystroke:

```typescript
const fetchAssets = useCallback(() => {
  let url = `http://localhost:8080/api/assets?page=${page}&size=10`;
  if (searchTerm.trim() !== "") {
    url += `&search=${encodeURIComponent(searchTerm.trim())}`;
  }
  fetch(url)
    .then(res => res.json())
    .then(data => {
      setAssets(data.content);
      setTotalPages(data.totalPages);
      setLoading(false);
    });
}, [page, searchTerm]);

useEffect(() => {
  const debounceTimer = setTimeout(() => {
    fetchAssets();
  }, 500);
  return () => clearTimeout(debounceTimer);
}, [fetchAssets]);
```

`useCallback` gives `fetchAssets` a new identity only when `page` or `searchTerm` changes, so the effect re-runs only when needed. Each re-run clears the previous timer in the effect's cleanup function, which is what makes the debounce work.

---

### Server-Side Pagination and Search

Filtering and pagination happen in the database, not in the browser. The repository uses a JPQL query that searches name, category and location case-insensitively:

```java
@Query(
    "SELECT p FROM PhysicalAsset p WHERE " +
    "LOWER(p.name) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
    "LOWER(p.category) LIKE LOWER(CONCAT('%', :searchTerm, '%')) OR " +
    "LOWER(p.location) LIKE LOWER(CONCAT('%', :searchTerm, '%'))"
)
Page<PhysicalAsset> searchAssets(@Param("searchTerm") String searchParam, Pageable pageable);
```

The service builds a `PageRequest` (default 10 items per page, sorted by `id`) and calls `searchAssets` when a search term is provided, or `findAll` otherwise. Only the requested page is sent to the client, together with the total page count used by the pagination controls.

---

### Validation and Data Normalization

Incoming data is checked at several points:

1. **Bean Validation on the entity**, triggered by `@Valid` in the controller:

   ```java
   @NotBlank(message = "Name is required and cannot be empty")
   @Size(min = 3, max = 100, message = "Name must be between 3 and 100 characters")
   @Column(nullable = false, length = 100)
   private String name;

   @NotBlank(message = "Condition is required")
   @Pattern(regexp = "^(Good|Fair|Poor|Unknown)$", message = "Condition must be Good, Fair, Poor, or Unknown")
   @Column(name = "asset_condition", nullable = false, length = 50)
   private String condition = "Unknown";
   ```

2. **A global exception handler** (`@RestControllerAdvice`) turns validation failures into a `400 Bad Request` with a field → message map (for example `{"name": "Name must be between 3 and 100 characters"}`).
3. **Service-layer checks**: the service validates the condition again, returns `404 Not Found` for missing assets, and normalizes text before saving (trims whitespace, converts to title case, and stores empty optional fields as `null`). For example, `"  cOmPUter MoNItor  "` is saved as `"Computer Monitor"`.
4. **Database columns** are created with `NOT NULL` and length limits based on the `@Column` mappings.

---

### Unit Tests

**Backend** ([PhysicalAssetServiceTest.java](backend/src/test/java/com/example/backend/service/PhysicalAssetServiceTest.java)) tests the service with a mocked repository:

- Text normalization before saving, verified with an `ArgumentCaptor`
- `updateAsset` throws `ResponseStatusException` with status `404` for an unknown ID
- `getAllAssets` calls the search query when a search term is provided

```java
@Test
void addAsset_ShouldNormalizeTextBeforeSaving() {
    PhysicalAsset messyAsset = new PhysicalAsset();
    messyAsset.setName("  cOmPUter MoNItor  ");
    messyAsset.setCategory("  eLEctronics ");
    messyAsset.setCondition("Good");
    messyAsset.setLocation("   ");

    when(repository.save(any(PhysicalAsset.class))).thenReturn(messyAsset);

    service.addAsset(messyAsset);

    ArgumentCaptor<PhysicalAsset> assetCaptor = ArgumentCaptor.forClass(PhysicalAsset.class);
    verify(repository).save(assetCaptor.capture());

    PhysicalAsset capturedAsset = assetCaptor.getValue();

    assertEquals("Computer Monitor", capturedAsset.getName());
    assertEquals("Electronics", capturedAsset.getCategory());
    assertEquals("Good", capturedAsset.getCondition(), "Condition should remain untouched");
    assertNull(capturedAsset.getLocation(), "Empty location should be converted to null");
}
```

The `ArgumentCaptor` captures the exact object passed to `repository.save()`, so the test checks the transformed data, not just that the method was called.

**Frontend** ([`src/__tests__/`](frontend/src/__tests__/)) tests components with React Testing Library:

- `Pagination`: shows the current and total page, calls `setPage` when *Next* is clicked, and disables *Next* on the last page
- `SearchBar`: calls `onSearchChange` as the user types

---

### Component Structure

The frontend is split into small components. `App.tsx` holds the state and API calls; the components receive data through props and report user actions through callbacks.

```
frontend/src/
├── components/
│   ├── AssetTable.tsx        # Table of assets with edit and delete actions
│   ├── AssetFormModal.tsx    # Shared form for creating and editing assets
│   ├── ConfirmModal.tsx      # Reusable confirmation dialog (used for delete)
│   ├── SearchBar.tsx         # Search input
│   ├── Pagination.tsx        # Previous / Next page controls
│   └── Header.tsx            # Page header
├── types/
│   └── Asset.ts              # PhysicalAsset TypeScript interface
├── __tests__/                # Vitest + React Testing Library tests
├── App.tsx                   # State, data fetching and debounced search
└── main.tsx                  # Entry point
```

---

## Getting Started (Local Setup)

### Prerequisites
- **Java 21** ([Eclipse Temurin](https://adoptium.net/) or any other JDK 21). If you use SDKMAN, the repository includes a `.sdkmanrc` file.
- **Node.js 20.19+ or 22.12+** ([Download](https://nodejs.org/))
- **PostgreSQL**: a free [Supabase](https://supabase.com/) project or a local [PostgreSQL](https://www.postgresql.org/download/) installation

Maven doesn't need to be installed separately, because the project includes the Maven Wrapper (`mvnw`).

### Step 1: Clone the Repository

```bash
git clone https://github.com/AxelVonReems/Classroom-Equipment-Tracker.git
cd Classroom-Equipment-Tracker
```

### Step 2: Set Up the Database

#### Option A: Supabase

1. Create a free account and a new project at [supabase.com](https://supabase.com/).
2. Open **Connect** in the project dashboard and copy the host, port, database name, user and password.

#### Option B: Local PostgreSQL

Run the following in `psql` (or pgAdmin):

```sql
CREATE DATABASE classroom_equipment_tracker;
CREATE USER tracker_user WITH PASSWORD 'your_password_here';
GRANT ALL PRIVILEGES ON DATABASE classroom_equipment_tracker TO tracker_user;
\c classroom_equipment_tracker
GRANT ALL ON SCHEMA public TO tracker_user;
```

The table is created automatically on first start (`spring.jpa.hibernate.ddl-auto=update`).

### Step 3: Configure Environment Variables

Create a `.env` file in the `backend/` directory. It is listed in `.gitignore`, so your credentials won't be committed.

**Supabase:**

```properties
SUPABASE_DB_URL=jdbc:postgresql://db.your-project-ref.supabase.co:5432/postgres
SUPABASE_DB_USERNAME=postgres
SUPABASE_DB_PASSWORD=your_password_here
```

**Local PostgreSQL:**

```properties
SUPABASE_DB_URL=jdbc:postgresql://localhost:5432/classroom_equipment_tracker
SUPABASE_DB_USERNAME=tracker_user
SUPABASE_DB_PASSWORD=your_password_here
```

The URL must start with `jdbc:postgresql://`, and the username and password go in their own variables, not in the URL. `application.properties` loads this file with `spring.config.import=optional:file:.env[.properties]`, so start the backend from the `backend/` directory.

### Step 4: Start the Backend

```bash
cd backend
./mvnw spring-boot:run
```

On Windows, use `mvnw.cmd spring-boot:run`.

When you see `Started ClassroomEquipmentTrackerApplication in ... seconds`, the API is available at `http://localhost:8080`.

**API Endpoints:**

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assets?page=0&size=10` | List assets (paginated) |
| `GET` | `/api/assets?search=desk&page=0&size=10` | Search by name, category or location |
| `GET` | `/api/assets/{id}` | Get one asset |
| `POST` | `/api/assets` | Create an asset |
| `PUT` | `/api/assets/{id}` | Update an asset |
| `DELETE` | `/api/assets/{id}` | Delete an asset |

### Step 5: Start the Frontend

In a new terminal:

```bash
cd frontend
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Step 6: Run the Tests

```bash
# Backend
cd backend
./mvnw test

# Frontend
cd frontend
npm test
```

---

## Project Structure

```
.
├── backend/                                  # Spring Boot REST API
│   ├── src/main/java/com/example/backend/
│   │   ├── controller/                       # REST endpoints
│   │   ├── service/                          # Business logic, validation, normalization
│   │   ├── repository/                       # Spring Data JPA repository
│   │   ├── model/                            # JPA entity with validation annotations
│   │   └── exception/                        # Global exception handler
│   ├── src/main/resources/
│   │   └── application.properties            # Database and JPA configuration
│   ├── src/test/java/com/example/backend/    # JUnit and Mockito tests
│   ├── pom.xml                               # Maven dependencies and plugins
│   └── mvnw, mvnw.cmd                        # Maven Wrapper
│
├── frontend/                                 # React + TypeScript app
│   ├── src/                                  # Components, types and tests (see above)
│   ├── package.json                          # npm dependencies and scripts
│   ├── tsconfig.json                         # TypeScript configuration
│   └── vite.config.ts                        # Vite configuration
│
└── README.md
```

---

## Design Decisions

### Why server-side pagination?
- Only one page of data is sent over the network, regardless of how many assets exist.
- The browser doesn't need to hold the whole inventory in memory.
- Search and pagination work together in a single database query.

### Why validate in several places?
- Bean Validation returns clear, field-specific error messages to the client.
- Service-layer checks protect the business rules even if the service is called from somewhere other than the controller.
- Database `NOT NULL` and length limits are a final safety net.

### Why debounce the search?
- Typing a word sends one request instead of one per keystroke.
- Fewer requests means less load on the API and the database.

---

## Known Limitations and Next Steps

- **Search performance:** `LIKE '%term%'` can't use a normal B-tree index, so search scans the whole table. For large datasets, a PostgreSQL trigram (`pg_trgm`) index or full-text search would help.
- **Page size limit:** the API doesn't cap the `size` parameter yet.
- **Configuration:** the API URL (`http://localhost:8080`) is hardcoded in the frontend and would move to a Vite environment variable for deployment.
- **Authentication:** there is no login or role-based access yet.
- **Tests:** next steps are controller tests with MockMvc and repository tests against a real PostgreSQL database (for example with Testcontainers).
