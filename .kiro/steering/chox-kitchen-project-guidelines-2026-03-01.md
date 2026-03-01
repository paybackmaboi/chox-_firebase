# CHOX Kitchen Project Guidelines

**Date:** March 1, 2026  
**Project:** CHOX Kitchen - Food Ordering System  
**Document Type:** Project-Specific Steering File

---

## Project Overview

CHOX Kitchen is a full-stack food ordering system with a premium "Dark/Gold" aesthetic. The system consists of:

- **Frontend**: React 19.2.0 application with Tailwind CSS
- **Backend**: Node.js/Express API with TypeScript and Sequelize ORM
- **Database**: MySQL
- **Authentication**: JWT-based admin authentication
- **File Uploads**: Multer for receipt images

---

## Tech Stack

### Frontend
- **Framework**: React 19.2.0
- **Routing**: React Router DOM 7.9.4
- **Styling**: Tailwind CSS 3.4.18
- **UI Components**: Headless UI, Heroicons, Lightswind
- **Animations**: Framer Motion 12.23.24
- **Maps**: React Leaflet, Google Maps API
- **Charts**: Recharts 3.6.0
- **Build Tool**: React Scripts 5.0.1

### Backend
- **Runtime**: Node.js with TypeScript 5.3.3
- **Framework**: Express 4.18.2
- **ORM**: Sequelize 6.35.2
- **Database**: MySQL2 3.6.5
- **Authentication**: JWT (jsonwebtoken 9.0.2), bcryptjs 2.4.3
- **File Upload**: Multer 2.0.2
- **Validation**: Express Validator 7.0.1
- **Dev Tools**: Nodemon, ts-node

---

## Project Structure

```
project-root/
├── src/                          # Frontend React application
│   ├── components/               # React components
│   │   ├── admin/               # Admin panel components
│   │   ├── hooks/               # Custom React hooks
│   │   ├── lib/                 # Utility libraries
│   │   └── lightswind/          # UI component library
│   ├── App.js                   # Main app component
│   └── App.css                  # Global styles
├── backend/                      # Backend API
│   ├── src/
│   │   ├── config/              # Database configuration
│   │   ├── database/            # Migration scripts
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Sequelize models
│   │   └── routes/              # API route handlers
│   ├── uploads/                 # Uploaded files (receipts)
│   └── server.js                # Express server entry
├── public/                       # Static assets
│   └── images/                  # Product images
└── .kiro/                       # Kiro configuration
    ├── steering/                # Steering files
    ├── patterns/                # Code patterns
    ├── specs/                   # Feature specs
    └── docs/                    # Documentation
```

---

## Design System & Branding

### Color Palette

**Primary Colors**:
- Background: `#1a1a1a` (Dark charcoal)
- Secondary Background: `#222222`, `#252525`
- Text: `#F5F5F5` (Off-white)

**Gold Accent Colors** (Brand Identity):
- Primary Gold: `#FFD700` (Gold)
- Secondary Gold: `#D4AF37` (Metallic gold)
- Tertiary Gold: `#F3D675` (Light gold)
- Dark Gold: `#AA8C2C`

**Utility Colors**:
- Gray: `#444`, `#666`, `gray-300`, `gray-400`, `gray-500`, `gray-600`
- Black: `#000`, `#050505`, `black/70`, `black/80`

### Typography

- **Font Family**: System font stack (font-display)
- **Headings**: Light to bold weights (300-700)
- **Body**: Regular weight (400)
- **Tracking**: Wide letter spacing for headings (`tracking-[0.3em]`, `tracking-widest`)

### Visual Effects

**Gold Glow Effects**:
```css
.gold-glow {
  box-shadow: 0 0 20px rgba(212, 175, 55, 0.4), 0 0 40px rgba(212, 175, 55, 0.2);
}

.gold-glow-strong {
  box-shadow: 0 0 30px rgba(255, 215, 0, 0.6), 0 0 60px rgba(255, 215, 0, 0.4), 0 0 90px rgba(255, 215, 0, 0.2);
}
```

**Animations**:
- Gold shimmer effect
- Gradient shift animation
- Pulse effects
- Smooth carousel transitions (1000ms cubic-bezier)

---

## React Component Guidelines

### Component Structure

All React components should follow this structure:

```jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
// Other imports...

const ComponentName = () => {
  // State declarations
  const [state, setState] = useState(initialValue);

  // Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);

  // Event handlers
  const handleEvent = () => {
    // Handler logic
  };

  return (
    <div className="container-classes">
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

### Styling Conventions

1. **Use Tailwind CSS classes** for all styling
2. **Dark/Gold theme** must be consistent across all components
3. **Responsive design**: Use `md:`, `lg:` breakpoints
4. **Animations**: Use Tailwind transitions and custom CSS animations
5. **Gold accents**: Use gold colors for CTAs, highlights, and interactive elements

### Component Naming

- **PascalCase** for component files: `Homepage.js`, `AdminLayout.js`
- **Descriptive names**: `OrdersReports.js`, `MenuManagement.js`
- **Admin components**: Prefix with `Admin` or place in `admin/` folder

---

## Backend API Guidelines

### API Structure

**Base URL**: `http://localhost:3001/api`

**Route Organization**:
- `/api/admin/signin` - Admin authentication
- `/api/admin/reports` - Sales reports
- `/api/admin/orders` - Order management
- `/api/admin/inventory` - Inventory management
- `/api/admin/products` - Product management
- `/api/orders` - Customer orders (public)

### Authentication

**JWT-based authentication**:
- Admin routes require authentication middleware
- Token passed in `Authorization` header: `Bearer <token>`
- Middleware: `authenticate` from `backend/src/middleware/auth.ts`

```typescript
import { authenticate } from '../middleware/auth';

router.use(authenticate); // Apply to all routes
```

### TypeScript Patterns

**Model Definition** (Sequelize):
```typescript
import { DataTypes, Model } from 'sequelize';
import sequelize from '../config/database';

class ModelName extends Model {
  public id!: number;
  public field!: string;
  public createdAt!: Date;
  public updatedAt!: Date;
}

ModelName.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    field: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
  },
  {
    sequelize,
    modelName: 'ModelName',
    tableName: 'table_name',
    timestamps: true,
  }
);

export default ModelName;
```

**Route Handler Pattern**:
```typescript
import { Router, Response } from 'express';
import { AuthenticatedRequest, authenticate } from '../middleware/auth';
import Model from '../models/Model';

const router = Router();

router.use(authenticate); // Require auth

router.get('/', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const data = await Model.findAll();
    res.json(data);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
```

### Error Handling

**Always use try-catch blocks**:
```typescript
try {
  // Database operations
  const result = await Model.findAll();
  res.json(result);
} catch (error) {
  console.error('Operation error:', error);
  res.status(500).json({ error: 'Internal server error' });
}
```

**Return JSON errors, NOT HTML**:
```typescript
res.status(404).type('json').json({ 
  error: 'Not found',
  path: req.path 
});
```

---

## File Upload Guidelines

### Receipt Images

**Storage Location**: `backend/uploads/receipts/`

**Naming Convention**: `receipt-{timestamp}-{random}.{ext}`

**Supported Formats**: PNG, JPG, JPEG, GIF, WebP

**Serving Files**:
- URL pattern: `/uploads/receipts/{filename}`
- CORS headers must be set
- Proper Content-Type headers required
- Case-insensitive filename matching

**Security**:
- Prevent directory traversal (no `..`, `/`, `\` in filenames)
- Validate file extensions
- Use absolute paths with `sendFile()`

---

## Database Conventions

### Table Naming

- **Lowercase with underscores**: `products`, `order_items`, `inventory_logs`
- **Plural form**: `products` (not `product`)

### Column Naming

- **snake_case**: `user_id`, `created_at`, `order_status`
- **Timestamps**: Always include `createdAt` and `updatedAt`

### Primary Keys

- **Auto-increment integers**: `id` (INTEGER, AUTO_INCREMENT, PRIMARY KEY)
- **UUIDs**: If using UUIDs, use `type: 'uuid'` and `defaultValue: DataTypes.UUIDV4`

### Relationships

- **Foreign keys**: Use `{model}_id` pattern (e.g., `user_id`, `product_id`)
- **Associations**: Define in model files using Sequelize associations

---

## NPM Scripts

### Frontend Scripts

```bash
npm start              # Start React dev server (port 3000)
npm run build          # Build for production
npm test               # Run tests
```

### Backend Scripts

```bash
npm run backend:dev    # Start backend dev server with nodemon
npm run backend:build  # Compile TypeScript
npm run backend:migrate # Run database migrations
npm run backend:seed   # Seed database with sample data
```

### Combined Scripts

```bash
npm run dev            # Run frontend + backend concurrently
npm run serve          # Build backend and start production server
```

---

## Admin Panel Features

### Access Control

**Admin Login**: `/admin/signin`
**Secret Registration**: `/admin/secret-register-99` (hidden from public)

### Admin Modules

1. **Sales Reports** (`/admin/reports`)
   - Total revenue and order counts
   - Daily/Monthly/Yearly trends
   - Interactive charts (Recharts)

2. **Order Management** (`/admin/orders`)
   - View all orders
   - Update order status: Pending → Preparing → Ready → On the Way → Delivered
   - Print receipts

3. **Inventory & Logs** (`/admin/inventory`)
   - Track stock levels
   - Add/remove inventory
   - View stock-in/stock-out logs

4. **Menu Management** (`/admin/menu`)
   - Add/edit/remove dishes
   - Upload product images
   - Organize by categories
   - Mark items as out of stock

5. **Account Settings** (`/admin/settings`)
   - Update admin profile
   - Change password

---

## Customer Features

### Public Routes

- `/` - Homepage with hero, menu highlights, testimonials
- `/menu` - Full menu with categories and search
- `/cart` - Shopping cart and checkout
- `/track/:orderId` - Order tracking with live status updates
- `/about` - About us page
- `/faq` - Frequently asked questions

### Order Tracking

- **URL Pattern**: `/track/{ORDER_ID}`
- **Features**: Live status updates, map-like timeline
- **Statuses**: Pending → Preparing → Ready → On the Way → Delivered

---

## Code Quality Standards

### TypeScript

- **Strict mode**: Use strict TypeScript settings
- **Type annotations**: Always annotate function parameters and return types
- **Interfaces**: Define interfaces for complex objects
- **No `any`**: Avoid using `any` type unless absolutely necessary

### React

- **Functional components**: Use functional components with hooks
- **PropTypes**: Not required (using TypeScript for type safety)
- **State management**: Use `useState` and `useEffect` hooks
- **Event handlers**: Prefix with `handle` (e.g., `handleClick`, `handleSubmit`)

### Naming Conventions

- **Variables**: camelCase (`userName`, `orderTotal`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`, `MAX_ITEMS`)
- **Functions**: camelCase (`fetchOrders`, `calculateTotal`)
- **Components**: PascalCase (`Homepage`, `OrderCard`)
- **Files**: PascalCase for components, camelCase for utilities

### Code Organization

- **One component per file**: Each React component in its own file
- **Group related files**: Admin components in `admin/` folder
- **Separate concerns**: Keep business logic separate from UI
- **Reusable utilities**: Extract common logic to utility functions

---

## Testing Guidelines

### Frontend Testing

- **Testing Library**: React Testing Library
- **Test files**: Place alongside component files with `.test.js` extension
- **Run tests**: `npm test`

### Backend Testing

- **Manual testing**: Use Postman or similar tools
- **Test endpoints**: Verify all API routes work correctly
- **Database testing**: Test migrations and seed scripts

---

## Deployment

### Frontend Deployment

- **Build**: `npm run build`
- **Output**: `build/` directory
- **Hosting**: Firebase Hosting (configured in `firebase.json`)

### Backend Deployment

- **Build**: `npm run backend:build`
- **Output**: `backend/dist/` directory
- **Start**: `npm run serve` or `node backend/server.js`
- **Environment**: Set `PORT`, `DATABASE_URL`, `JWT_SECRET`, `FRONTEND_URL`

---

## Environment Variables

### Backend (.env)

```env
PORT=3001
DATABASE_HOST=localhost
DATABASE_USER=root
DATABASE_PASSWORD=your_password
DATABASE_NAME=chox_kitchen
JWT_SECRET=your_jwt_secret
FRONTEND_URL=http://localhost:3000
```

### Frontend

- **API URL**: Configured in code (default: `http://localhost:3001`)
- **Firebase**: Configured in Firebase console

---

## Common Patterns

### Loading States

```jsx
const [loading, setLoading] = useState(false);

const fetchData = async () => {
  setLoading(true);
  try {
    const response = await fetch('/api/endpoint');
    const data = await response.json();
    // Handle data
  } catch (error) {
    console.error('Error:', error);
  } finally {
    setLoading(false);
  }
};
```

### Error Handling

```jsx
const [error, setError] = useState(null);

try {
  // Operation
} catch (err) {
  setError(err.message);
  console.error('Error:', err);
}
```

### API Calls

```jsx
const fetchOrders = async () => {
  try {
    const response = await fetch('http://localhost:3001/api/admin/orders', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch orders');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
};
```

---

## Security Best Practices

### Authentication

- **JWT tokens**: Store securely (localStorage or httpOnly cookies)
- **Token expiration**: Implement token refresh mechanism
- **Password hashing**: Use bcryptjs with salt rounds ≥ 10

### Input Validation

- **Backend validation**: Always validate on server side
- **Express Validator**: Use for request validation
- **Sanitize inputs**: Prevent SQL injection and XSS

### File Uploads

- **Validate file types**: Check extensions and MIME types
- **Limit file size**: Set reasonable limits (e.g., 5MB)
- **Secure storage**: Store outside web root if possible
- **Prevent directory traversal**: Validate filenames

### CORS

- **Whitelist origins**: Only allow trusted frontend URLs
- **Credentials**: Enable only if needed
- **Methods**: Limit to required HTTP methods

---

## Troubleshooting

### Common Issues

**Issue**: Receipt images not loading
- **Solution**: Check `uploadsPath` in backend, verify file exists, check CORS headers

**Issue**: Database connection failed
- **Solution**: Verify MySQL is running, check credentials in `.env`

**Issue**: JWT authentication failing
- **Solution**: Verify token is being sent, check JWT_SECRET matches

**Issue**: TypeScript compilation errors
- **Solution**: Run `npm run backend:build`, check type definitions

---

## Additional Resources

### Documentation

- React: https://react.dev/
- Tailwind CSS: https://tailwindcss.com/
- Sequelize: https://sequelize.org/
- Express: https://expressjs.com/

### Project-Specific Docs

- README.md - System overview and admin guide
- Backend API routes - See `backend/src/routes/`
- Database models - See `backend/src/models/`

---

## Notes for AI Assistants

### When Working on This Project

1. **Always maintain the Dark/Gold aesthetic** - this is the brand identity
2. **Use Tailwind CSS** for all styling - no inline styles or CSS modules
3. **Follow TypeScript patterns** for backend code
4. **Authenticate admin routes** - use the `authenticate` middleware
5. **Handle errors gracefully** - always use try-catch and return JSON errors
6. **Test file uploads** - verify receipt images are served correctly
7. **Maintain responsive design** - test on mobile, tablet, and desktop
8. **Keep animations smooth** - use cubic-bezier easing for premium feel
9. **Validate inputs** - both frontend and backend validation required
10. **Document changes** - update this steering file if patterns change

### Code Review Checklist

Before submitting code:
- [ ] Dark/Gold theme maintained
- [ ] Tailwind CSS used for styling
- [ ] TypeScript types defined (backend)
- [ ] Error handling implemented
- [ ] Authentication applied (admin routes)
- [ ] Responsive design tested
- [ ] Animations smooth and performant
- [ ] No console errors
- [ ] Code follows project patterns
- [ ] Documentation updated if needed

---

**Document created:** March 1, 2026  
**Created by:** Kiro AI Assistant  
**Last updated:** March 1, 2026
