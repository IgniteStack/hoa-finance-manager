# HOA Community Finance Manager

A comprehensive financial management system for Homeowners Associations with role-based access control, user account management, push notifications, CRUD operations across multiple entities, advanced reporting with dynamic charts, and comprehensive data relationships between neighbors, payments, expenses, and fiscal periods.

**Experience Qualities**:
1. **Professional & Trustworthy** - Clean interface with clear financial data presentation that builds confidence in community financial management
2. **Efficient & Organized** - Streamlined workflows that reduce administrative burden and make complex financial tasks simple
3. **Connected & Transparent** - Real-time notifications and clear communication channels that keep all stakeholders informed

**Complexity Level**: Complex Application (advanced functionality, likely with multiple views)

This is a multi-module financial management system with role-based access control, user account management with auto-generated passwords, push notification system, CRUD operations across multiple entities, advanced reporting with dynamic charts, messaging with notifications, and comprehensive data relationships between neighbors, payments, expenses, and fiscal periods.

## Essential Features

### User Account Management (NEW)
- **Functionality**: Admin can create user accounts with auto-generated passwords that must be changed on first login
- **Purpose**: Secure user onboarding with forced password changes for better security
- **Trigger**: Admin navigates to Users page and clicks Add User
- **Progression**: Admin enters user details → System generates secure password → Admin copies password → User receives credentials → User logs in → User must change password → User gains access
- **Success criteria**: User accounts are created with secure passwords, users are forced to change password on first login, admins can reset passwords when needed

### Push Notification System (NEW)
- **Functionality**: Browser push notifications for messages and important updates with in-app notification center
- **Purpose**: Keep users informed in real-time about community updates, messages, and important events
- **Trigger**: Admin sends message, or system events occur
- **Progression**: Event occurs → Notification created → Browser push sent (if enabled) → Toast notification shown → Notification appears in bell icon → User views/dismisses notification
- **Success criteria**: Notifications are delivered reliably, users can enable/disable push notifications, notification history is maintained

### Authentication & Authorization
- **Functionality**: Secure login with role-based access (Admin vs Neighbor) with password management
- **Purpose**: Protect sensitive financial data and restrict editing capabilities to authorized admins
- **Trigger**: User accesses the application
- **Progression**: User enters credentials → System validates → Password change required if first login → User authenticated → Role-based UI displayed
- **Success criteria**: Only authenticated users access system, admins see full features, neighbors see limited view

### Neighbor Management
- **Functionality**: Track community members with house assignments, contact info, ownership status, and account balances
- **Purpose**: Maintain accurate resident directory for billing and communication
- **Trigger**: Admin adds/edits neighbor information
- **Progression**: Admin clicks Add → Enters neighbor details → Selects house number → Sets ownership status → Saves → Neighbor appears in directory
- **Success criteria**: All active neighbors are tracked with current information and accurate balances

### Member Profile Pages (NEW)
- **Functionality**: Detailed member profile pages showing complete payment history and document uploads
- **Purpose**: Provide comprehensive view of member's financial relationship with HOA and store important documents
- **Trigger**: Admin clicks View Profile from member list, or member accesses "My Profile" from user menu
- **Progression**: User views profile → See member details and complete payment history → Upload documents (contracts, receipts, IDs) → Download or delete documents → Return to member list
- **Success criteria**: Members can view their own profiles and documents, admins can view any member profile, documents are securely stored with metadata, payment history is complete and accurate

### Payment Tracking
- **Functionality**: Record all payments received from neighbors
- **Purpose**: Maintain accurate financial records and update neighbor balances
- **Trigger**: Admin or system receives payment
- **Progression**: Admin clicks Add Payment → Selects neighbor → Enters amount and date → Optional fiscal period assignment → Saves → Balance updates → Payment appears in history
- **Success criteria**: All payments are recorded, neighbor balances update correctly, payments can be reversed if needed

### Expense Management
- **Functionality**: Track all HOA expenses with categorization and documentation
- **Purpose**: Monitor spending and maintain budget control
- **Trigger**: Admin records an expense
- **Progression**: Admin clicks Add Expense → Enters concept/amount → Adds category and notes → Assigns to fiscal period → Saves → Dashboard updates
- **Success criteria**: All expenses are documented, spending patterns are visible, expenses can be categorized for reporting

### Financial Periods
- **Functionality**: Define time periods for financial reporting and analysis
- **Purpose**: Enable time-based financial analysis and comparisons
- **Progression**: Admin creates period → Selects type and date range → Period filters become available → Financial reports show period-specific data → Admin can close periods
- **Success criteria**: Multiple period types supported, reports filter correctly by period, closed periods prevent modifications

### Dashboard & Analytics
- **Functionality**: Visual representation of financial health with interactive charts
- **Purpose**: Provide at-a-glance financial status and trend analysis
- **Trigger**: User logs in or navigates to Dashboard
- **Progression**: Dashboard loads → Charts render with current data → User can filter by fiscal period → Metrics update in real-time
- **Success criteria**: Key metrics are immediately visible, charts are interactive and accurate, data updates reflect recent changes

### Messaging System
- **Functionality**: Admin sends announcements to all or selected neighbors with push notifications
- **Purpose**: Streamline admin communication with the community
- **Progression**: Admin composes message → Selects recipients (all or specific neighbors) → Sends → Notifications sent to all recipients → Message history stored
- **Success criteria**: Messages reach intended recipients, notification system triggers, message history is maintained

## Edge Case Handling
- **Empty States**: Graceful handling when no data exists with helpful prompts to add first entries
- **Duplicate Entries**: Warn when adding similar expenses or payments to prevent accidental duplicates
- **Invalid House Numbers**: Validation ensures house numbers are within configured range
- **Period Overlaps**: Ensure fiscal periods don't create ambiguous date ranges
- **Balance Calculations**: Real-time balance updates even when payments/expenses are reversed
- **Notification Permissions**: Handle denied browser notification permissions gracefully with fallback to in-app notifications only
- **Password Security**: Enforce minimum password requirements and secure password storage
- **File Upload Limits**: Documents are limited to 5MB with accepted formats (PDF, DOC, DOCX, JPG, PNG)
- **Document Access Control**: Members can only view/upload their own documents, admins can view/manage all documents

## Design Direction

The design should evoke trust, efficiency, and clarity - like a well-organized financial ledger brought into the modern age. Professional enough for serious financial management, but approachable enough for non-financial community members to use confidently.

## Color Selection

A professional palette with a calming blue foundation and warm accent for important actions.

- **Primary Color**: Deep blue oklch(0.45 0.08 200) - Professional, trustworthy, stable
- **Secondary Colors**: 
  - Soft gray oklch(0.98 0 0) for main background
  - Light blue-gray oklch(0.92 0.02 200) for secondary elements
- **Accent Color**: Warm amber oklch(0.68 0.15 35) - Calls attention to important actions and notifications
- **Destructive**: Warm red oklch(0.55 0.22 25) - Clear warning for dangerous actions
- **Foreground/Background Pairings**:
  - Primary (Deep Blue): White text oklch(1 0 0) - Ratio 7.2:1 ✓
  - Accent (Warm Amber): White text oklch(1 0 0) - Ratio 4.9:1 ✓
  - Background (Soft Gray): Dark text oklch(0.25 0 0) - Ratio 12.8:1 ✓
  - Muted backgrounds: Medium gray oklch(0.50 0 0) text - Ratio 4.6:1 ✓

## Font Selection

Typography should balance professional clarity with approachable warmth, using modern geometric sans-serifs that work well for both financial data and conversational text.

- **Typographic Hierarchy**:
  - H1 (Page Titles): Plus Jakarta Sans Bold / 32px / -0.02em letter spacing
  - H2 (Section Headers): Plus Jakarta Sans SemiBold / 24px / -0.01em
  - H3 (Card Titles): Plus Jakarta Sans SemiBold / 18px / normal
  - Body Text: Plus Jakarta Sans Regular / 14px / 1.5 line height
  - Small Text (Labels): Plus Jakarta Sans Medium / 12px / 0.01em tracking
  - Numbers/Data: JetBrains Mono Medium / variable sizes / tabular nums

## Animations

Animations should feel responsive and purposeful, reinforcing user actions without creating delays. Subtle transitions maintain spatial relationships while adding moments of delight during key interactions.

- **Button interactions**: Quick scale and color transitions (150ms) for immediate tactile feedback
- **Notifications**: Slide in from top-right with gentle bounce, auto-dismiss after 4s with fade
- **Dialog/Sheet**: Smooth scale and opacity entrance (200ms) that feels lightweight
- **Data updates**: Subtle highlight flash on changed values (300ms) to draw attention to updates
- **Page transitions**: Minimal - instant content swap to keep users moving quickly

## Component Selection

- **Components**:
  - **Sidebar**: Main navigation with role-based menu items (neighbors, expenses, payments, reports, messaging for admins)
  - **Dialog**: User creation, password changes, and critical confirmations
  - **Sheet**: Mobile navigation drawer
  - **Table**: Primary data display for neighbors, payments, expenses with sortable columns
  - **Card**: Dashboard metrics, summaries, and grouped content sections
  - **Form, Input, Label, Select, Switch**: Consistent form controls with validation states
  - **Badge**: Status indicators (Active/Inactive, Owner/Tenant, Must Change Password)
  - **Button**: Primary actions, secondary actions, and icon buttons with clear visual hierarchy
  - **Popover**: Notification center dropdown
  - **Alert**: Important messages and notifications
  - Custom chart components wrapping Recharts for consistent styling

- **Customizations**:
  - Password strength indicator for password change dialog
  - Notification bell with badge counter
  - Copy-to-clipboard button for generated passwords
  - Toggle password visibility in password fields

- **States**:
  - Buttons: Hover with subtle scale, active with pressed state, disabled with opacity
  - Inputs: Focus with accent border and subtle glow, error state with destructive color and icon
  - Table rows: Hover with light background, selected with border accent
  - Cards: Subtle shadow on hover for interactive cards
  - Notifications: Unread with accent background, read with normal background

- **Icon Selection**:
  - @phosphor-icons/react throughout
  - House for neighbors/properties
  - CurrencyDollar for payments
  - Receipt for expenses  
  - ChartLine for analytics
  - CalendarBlank for periods
  - ChatCircle for messaging
  - User/UserGear/UserCircle for roles, user management, and profiles
  - Bell for notifications
  - Key for password operations
  - Eye/EyeSlash for password visibility
  - Plus for add actions
  - PencilSimple for edit
  - Trash for delete
  - MagnifyingGlass for search
  - Copy for clipboard operations
  - Upload for document uploads
  - Download for document downloads
  - File/FileText/Receipt/IdentificationCard/Folder for document categories
  - ArrowLeft for back navigation

- **Spacing**:
  - Page padding: p-6 (24px)
  - Card padding: p-6 (24px)
  - Form field gaps: gap-4 (16px)
  - Button padding: px-4 py-2 (16px/8px)
  - Section margins: mb-8 (32px)
  - Grid gaps: gap-6 (24px)

- **Mobile**:
  - Sidebar collapses to bottom sheet menu
  - Tables switch to card layout with stacked fields
  - Dashboard grid becomes single column
  - Forms maintain full width with larger touch targets (min 44px)
  - Charts optimize for vertical space with adjusted aspect ratios
  - Dialogs become full-screen on mobile for better form interaction
  - Notification popover adjusts width for smaller screens
  - Member profile grids stack vertically on mobile
  - Document tables become card-based layout on mobile with action buttons
