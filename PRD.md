# HOA Community Finance Manager

A comprehensive financial management system for residential communities, homeowners associations, and neighborhood administrations to track expenses, income, neighbor information, and community communications.

**Experience Qualities**:
1. **Professional** - Clean, business-focused interface that inspires trust and confidence in financial data accuracy
2. **Efficient** - Streamlined workflows for common tasks like registering payments, adding expenses, and viewing reports
3. **Transparent** - Clear visualization of financial data with accessible charts and reports for all community members

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)
This is a multi-module financial management system with role-based access control, CRUD operations across multiple entities, advanced reporting with dynamic charts, AI-assisted messaging, and comprehensive data relationships between neighbors, payments, expenses, and fiscal periods.

## Essential Features

### Authentication & Authorization
- **Functionality**: Secure login with role-based access (Admin vs Neighbor)
- **Purpose**: Protect sensitive financial data and restrict editing capabilities to authorized admins
- **Trigger**: User accesses the application
- **Progression**: Landing on login page → Enter credentials → Role validation → Route to appropriate dashboard
- **Success criteria**: Admins see full interface with CRUD controls; Neighbors see read-only dashboards

### Neighbor Registry (Module 1)
- **Functionality**: Complete CRUD management of community residents with detailed profiles
- **Purpose**: Maintain accurate records of who lives in the community and their contact information
- **Trigger**: Admin clicks "Neighbors" in navigation or "Add Neighbor" button
- **Progression**: View neighbor list → Click add/edit → Fill form (names, house number, phone, ownership status, role, active flag) → Save → Updates persist and appear in lists/dropdowns
- **Success criteria**: Neighbors can be created, updated, searched, and linked to payments; inactive neighbors are visually distinct

### Expense Management (Module 2)
- **Functionality**: Track all community expenses with categorization and notes
- **Purpose**: Maintain transparency on where community funds are spent
- **Trigger**: Admin navigates to Expenses section
- **Progression**: View expense list → Add new expense → Enter concept, amount, date, notes → Save → Expense appears in reports and charts
- **Success criteria**: Expenses can be filtered by date period, edited, deleted, and automatically included in financial analytics

### Income/Payment Registry (Module 3)
- **Functionality**: Record all payments received from neighbors
- **Purpose**: Track who has paid their dues and when
- **Trigger**: Admin or system receives payment
- **Progression**: Navigate to Payments → Add payment → Select neighbor, enter amount, concept, date → Link to bank account (optional) → Save → Payment recorded
- **Success criteria**: Payments are linked to specific neighbors and houses, appear in payment history, and contribute to income totals

### Financial Periods (Module 4)
- **Functionality**: Define fiscal reporting periods (monthly, quarterly, yearly)
- **Purpose**: Enable time-based financial analysis and comparisons
- **Trigger**: Admin configures reporting period in settings or dashboard filter
- **Progression**: Select period type → Choose date range → All reports/charts update → View filtered data
- **Success criteria**: All financial data can be filtered and aggregated by selected period; charts update dynamically

### Analytics Dashboard (Module 5)
- **Functionality**: Visual representation of financial health with interactive charts
- **Purpose**: Provide at-a-glance understanding of community finances
- **Trigger**: User logs in or navigates to Dashboard
- **Progression**: Dashboard loads → Charts render (Income vs Expenses, Expenses by Category, Payments by Neighbor, Monthly Balance) → User can interact/filter → Data updates based on selected period
- **Success criteria**: Charts accurately reflect data, update in real-time, and are accessible to both admins and neighbors

### WhatsApp Group Management (Module 6)
- **Functionality**: AI-assisted community communication for announcements and reminders
- **Purpose**: Streamline admin communication with natural language commands
- **Trigger**: Admin types message or command in messaging interface
- **Progression**: Admin enters text → AI interprets intent → Generates appropriate message → Admin reviews → Send to community
- **Success criteria**: AI correctly interprets commands like "send payment reminder", "report monthly expenses", "notify about meeting" and generates contextual messages

### Role-Based Permissions (Module 7)
- **Functionality**: Different capabilities based on user role
- **Purpose**: Protect data integrity while allowing transparency
- **Trigger**: Automatic based on logged-in user role
- **Progression**: Role detected → UI elements rendered accordingly → Actions validated against permissions
- **Success criteria**: Admins see edit/delete buttons and forms; Neighbors see read-only views with no modification options

## Edge Case Handling

- **Empty States**: Show helpful messages when no neighbors, expenses, or payments exist yet with clear call-to-action to add first entry
- **Invalid Dates**: Validate date inputs to prevent future dates where inappropriate and ensure chronological consistency
- **Duplicate Entries**: Warn when adding similar expenses or payments that might be duplicates
- **Inactive Neighbors**: Visually distinguish and optionally filter out inactive neighbors from active dropdowns
- **Zero/Negative Amounts**: Validate that monetary amounts are positive numbers
- **Missing Relationships**: Handle gracefully when payment references deleted neighbor or expense category no longer exists
- **Period Overlaps**: Ensure fiscal periods don't create ambiguous date ranges
- **Unauthorized Actions**: Silently hide or disable features neighbors shouldn't access rather than showing error messages

## Design Direction

The design should evoke trust, clarity, and professionalism - like a modern financial dashboard meets community bulletin board. It should feel approachable yet authoritative, with warm human touches that remind users this is about their neighborhood community, not a cold corporate system. Data should be immediately scannable with generous use of color-coding, clear typography hierarchy, and inviting charts that make financial information accessible to non-accountants.

## Color Selection

A trustworthy financial palette with warm community accents.

- **Primary Color**: Deep teal oklch(0.45 0.08 200) - Conveys reliability and financial stability while being more approachable than navy
- **Secondary Colors**: 
  - Light teal background oklch(0.96 0.02 200) for cards and panels
  - Soft gray oklch(0.98 0 0) for main background
- **Accent Color**: Warm coral oklch(0.68 0.15 35) - Attention-grabbing for CTAs, notifications, and important financial figures
- **Foreground/Background Pairings**:
  - Primary (Deep Teal): White text oklch(1 0 0) - Ratio 8.2:1 ✓
  - Accent (Warm Coral): White text oklch(1 0 0) - Ratio 4.6:1 ✓
  - Background (Soft Gray): Dark gray text oklch(0.25 0 0) - Ratio 13.1:1 ✓
  - Muted backgrounds: Medium gray text oklch(0.50 0 0) - Ratio 4.9:1 ✓

## Font Selection

Typography should balance professional clarity with approachable warmth, using a modern sans-serif for UI elements and a complementary font for data-heavy tables.

- **Primary Font**: 'Plus Jakarta Sans' - A friendly geometric sans with excellent readability for UI elements
- **Secondary Font**: 'JetBrains Mono' - For numerical data, amounts, and tables to enhance scanability

**Typographic Hierarchy**:
- H1 (Page Titles): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing
- H2 (Section Headers): Plus Jakarta Sans Semibold / 24px / -0.01em letter spacing  
- H3 (Card Titles): Plus Jakarta Sans Semibold / 18px / normal letter spacing
- Body Text: Plus Jakarta Sans Regular / 15px / 0.01em letter spacing
- Small Text (Labels): Plus Jakarta Sans Medium / 13px / 0.02em letter spacing
- Numbers/Data: JetBrains Mono Medium / 15px / normal letter spacing

## Animations

Animations should enhance usability without slowing down frequent operations. Use subtle transitions to maintain context during navigation, micro-interactions on buttons and form inputs for tactile feedback, and smooth chart animations when data updates. Loading states should use purposeful skeleton screens rather than generic spinners. Keep all animations under 300ms for form interactions, 400ms for navigation transitions.

## Component Selection

- **Components**:
  - **Sidebar**: Main navigation with role-based menu items (neighbors, expenses, payments, reports, messaging for admins)
  - **Card**: Container for dashboard widgets, data summaries, and form sections
  - **Table**: For neighbor lists, expense records, payment history with sortable columns
  - **Dialog**: For add/edit forms (neighbor, expense, payment) keeping context visible
  - **Form, Input, Label, Select, Switch**: For all data entry with validation
  - **Button**: Primary (submit, add), Secondary (cancel), Destructive (delete)
  - **Tabs**: For switching between different report views or time periods
  - **Calendar**: Date picker for expense/payment dates
  - **Badge**: Status indicators (Active/Inactive, Owner/Tenant, Admin/Neighbor)
  - **Avatar**: User profile display in header
  - **Sonner (toast)**: Success/error feedback for CRUD operations
  - **Separator**: Visual dividers in forms and lists

- **Customizations**:
  - Custom chart components wrapping Recharts for consistent styling
  - Enhanced table component with inline editing capabilities for admins
  - Period selector component for fiscal period filtering
  - Neighbor selector with search and house number display
  - AI message composer with command interpretation preview

- **States**:
  - Buttons: Hover with subtle scale (1.02), active with slight depress, disabled with opacity and cursor change
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
