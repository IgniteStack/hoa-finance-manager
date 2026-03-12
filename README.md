# HOA Finance Manager

A complete web application for managing finances of residential communities (HOA / neighborhood administration).

## Features

### Multi-User Support & Data Synchronization

**The application supports multiple users accessing and modifying data simultaneously.** All data is stored using Spark's KV storage system, which automatically synchronizes across all active sessions.

#### How Data Sync Works:

- **Automatic Persistence**: Every change (neighbors, expenses, payments, fiscal periods) is immediately saved to the cloud-based KV store
- **Real-Time Updates**: The `useKV` hook from Spark automatically reflects changes made by other users
- **Multi-Session Compatible**: Multiple users can be logged in and working simultaneously
- **No Manual Refresh Needed**: Changes propagate automatically to all active sessions

#### Testing Multi-User Sync:

1. Open the app in two different browsers (e.g., Chrome and Firefox) or two incognito windows
2. Log in as an admin in both windows
3. Add a neighbor in one window
4. The new neighbor will appear in the other window automatically
5. The same applies to expenses, payments, and all other data

### User Roles

1. **Admin**: Full access to all features including:
   - Create, edit, delete neighbors
   - Manage expenses and payments
   - Create and close fiscal periods
   - Send messages to the community
   - View all dashboards and reports

2. **Neighbor**: Read-only access to:
   - View dashboards
   - View reports and charts
   - View payment history
   - View community information

### Modules

#### 1. Neighbor Management
- Register neighbors with detailed information (name, house number, contact details)
- Track ownership status (Owner / Tenant)
- Manage active/inactive status
- House numbers are validated based on total community houses

#### 2. Expense Management  
- Record community expenses with concepts, amounts, and dates
- Track expense status (draft, active, reversed)
- Expenses can be posted and reversed (if period is open)

#### 3. Payment Tracking
- Register payments from neighbors
- Link payments to specific houses and neighbors
- Optional bank account tracking
- Payment status management

#### 4. Fiscal Periods
- Define accounting periods (monthly, quarterly, yearly, custom)
- Close periods to lock financial records
- Prevent edits to closed period transactions

#### 5. Analytics Dashboard
- Real-time financial overview
- Income vs. Expenses tracking
- Monthly balance calculations
- Active neighbors count
- Visual charts and metrics

#### 6. Messaging (Admin Only)
- Send announcements to the community
- WhatsApp integration ready for future enhancements

### Initial Setup Wizard

On first launch, the app guides you through:
1. Creating the first admin account
2. Setting up community details (name, number of houses)
3. Creating initial fiscal periods
4. Ready to add neighbors and start tracking finances

### Technical Stack

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: shadcn/ui v4
- **Icons**: Phosphor Icons
- **Data Persistence**: Spark KV Storage (cloud-synced)
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod validation
- **Date Handling**: date-fns

### Default Credentials

After setup, you can also use these test accounts:

**Admin Account**:
- Email: admin@hoa.com  
- Password: admin123

**Neighbor Account**:
- Email: neighbor@hoa.com
- Password: neighbor123

### Data Storage

All application data is stored in Spark's key-value (KV) store:

- `system-config`: Configuration settings and setup status
- `neighbors`: Array of all registered neighbors
- `expenses`: Array of all expenses
- `payments`: Array of all payments
- `fiscal-periods`: Array of fiscal period definitions
- `auth-user`: Currently logged-in user information

The KV store is:
- ✅ Persistent across sessions
- ✅ Automatically backed up
- ✅ Synchronized across multiple users
- ✅ Accessible via the Spark runtime API

### Color Scheme

The app uses a professional, trust-inspiring color palette:
- **Primary**: Deep blue for authority and reliability
- **Accent**: Warm orange for calls-to-action and highlights
- **Background**: Light warm gray for comfortable extended viewing
- **Typography**: Plus Jakarta Sans (headings) + JetBrains Mono (numbers/data)

### Development Notes

#### Custom Hooks

- `useKV`: Spark's reactive key-value store hook (auto-syncing)
- `useSyncKV`: Enhanced version with polling for guaranteed fresh data
- `useIsMobile`: Responsive breakpoint detection
- `useAuth`: Authentication and authorization context

#### Component Structure

```
src/
├── components/
│   ├── dashboard/       # Dashboard and period management
│   ├── finance/         # Expense and payment components
│   ├── messaging/       # Messaging features
│   ├── neighbors/       # Neighbor management
│   ├── setup/          # Initial setup wizard
│   └── ui/             # shadcn components
├── contexts/           # React contexts (Auth)
├── hooks/              # Custom React hooks
└── lib/               # Utilities and types
```

### Responsive Design

The application is fully responsive and optimized for:
- ✅ Desktop (1920px+)
- ✅ Laptop (1024px - 1920px)
- ✅ Tablet (768px - 1024px)  
- ✅ Mobile (320px - 768px)

Mobile features:
- Collapsible navigation menu
- Touch-friendly buttons and inputs
- Optimized table views (card layout on mobile)
- Stacked form layouts

### Future Enhancements

- Push notifications for payment reminders
- WhatsApp API integration for messaging
- PDF report generation
- Email notifications
- Mobile app (React Native)
- Automated payment processing
- Budget forecasting

### Support

For issues or questions about data synchronization or any other features, please check that:
1. You're using a modern browser (Chrome, Firefox, Safari, Edge)
2. JavaScript is enabled
3. You have an active internet connection (required for KV sync)
