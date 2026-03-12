# HOA Community Finance Manager

**Experience Qualities**:

**Experience Qualities**:
This is a multi-module financial management system with role-based access control, CRUD operations across multiple en
## Essential Features
### Authentication & Authorization

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-module financial management system with role-based access control, CRUD operations across multiple entities, advanced reporting with dynamic charts, AI-assisted messaging, and comprehensive data relationships between neighbors, payments, expenses, and fiscal periods.

## Essential Features

### Authentication & Authorization
- **Functionality**: Secure login with role-based access (Admin vs Neighbor)
- **Purpose**: Protect sensitive financial data and restrict editing capabilities to authorized admins
- **Trigger**: User accesses the application
- **Functionality**: Record all payments received from neighbors
- **Trigger**: Admin or system receives payment

### Financial Periods (Module 4)
- **Purpose**: Enable time-based financial analysis and comparisons
- **Progression**: Select period type → Choose date range → All reports/charts update → View filtere

- **Functionality**: Visual representation of financial health with interactive charts
- **Trigger**: User logs in or navigates to Dashboard

### WhatsApp Group Management (Mo
- **Purpose**: Streamline admin communication with natural language commands
- **Progression**: Admin enters text → AI interprets intent → Generates

- **Functionality**: Different capabilities based on user role
- **Trigger**: Automatic based on logged-in user role

## Edge Case Handling
- **Functionality**: Record all payments received from neighbors
- **Duplicate Entries**: Warn when adding similar exp
- **Trigger**: Admin or system receives payment
- **Period Overlaps**: Ensure fiscal periods don't create ambiguous date ranges


### Financial Periods (Module 4)

- **Purpose**: Enable time-based financial analysis and comparisons
- **Secondary Colors**: 
  - Soft gray oklch(0.98 0 0) for main background
- **Foreground/Background Pairings**:

  - Muted backgrounds: Medium gray
- **Functionality**: Visual representation of financial health with interactive charts
Typography should balance professional clarity with approachable warmt
- **Trigger**: User logs in or navigates to Dashboard

- H1 (Page Titles): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing

- Small Text (Labels): Plus Jakarta Sans

- **Purpose**: Streamline admin communication with natural language commands


  - **Sidebar**: Main navigation with role-based menu items (neighbors, expenses, payments, reports, messaging for admins)

  - **Form, Input, Label, Select, Swi
- **Functionality**: Different capabilities based on user role
  - **Badge**: Status indicators (Active/Inactive, Owner/Tenant, 
- **Trigger**: Automatic based on logged-in user role

  - Custom chart components wrapping Recharts for consistent styling

## Edge Case Handling

  - Inputs: Focus with accent border and subtle glow, error state with destructive color and icon
  - Cards: Subtle shadow on hover for interactive cards
- **Icon Selection**:
  - House for neighbors/properties
  - Receipt for expenses  
  - CalendarBlank for periods
- **Period Overlaps**: Ensure fiscal periods don't create ambiguous date ranges
  - PencilSimple for edit

- **Spacing**:

  - Button padding: px-4 py-2 (16px/8px)

- **Mobile**:

  - Forms maintain full width with larger touch targets (min


- **Secondary Colors**: 

  - Soft gray oklch(0.98 0 0) for main background

- **Foreground/Background Pairings**:





## Font Selection







- H1 (Page Titles): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing













  - **Sidebar**: Main navigation with role-based menu items (neighbors, expenses, payments, reports, messaging for admins)













  - Custom chart components wrapping Recharts for consistent styling







  - Inputs: Focus with accent border and subtle glow, error state with destructive color and icon
  - Table rows: Hover with light background, selected with border accent
  - Cards: Subtle shadow on hover for interactive cards

- **Icon Selection**:
  - @phosphor-icons/react throughout
  - House for neighbors/properties
  - CurrencyDollar for payments
  - Receipt for expenses  
  - ChartLine for analytics
  - CalendarBlank for periods
  - ChatCircle for messaging
  - User/UserGear for roles
  - Plus for add actions
  - PencilSimple for edit
  - Trash for delete
  - MagnifyingGlass for search

- **Spacing**:
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Form field gaps: gap-4 (16px)
  - Button padding: px-4 py-2 (16px/8px)
  - Section margins: mb-8 (32px)
  - Grid gaps: gap-6 (24px)

- **Mobile**:
  - Sidebar collapses to bottom navigation bar
  - Tables switch to card layout with stacked fields
  - Dashboard grid becomes single column
  - Forms maintain full width with larger touch targets (min 44px)
  - Charts optimize for vertical space with adjusted aspect ratios
  - Dialogs become full-screen on mobile for better form interaction
