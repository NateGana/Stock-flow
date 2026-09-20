# StockFlow

A modern inventory and stock management system for small businesses. StockFlow helps you track products, monitor stock levels, manage suppliers, and log every inventory movement — all from a clean, dashboard-driven interface.

## Description

StockFlow is a frontend-only inventory management application. It gives a small business owner or warehouse manager a single place to see how much stock they have, what needs reordering, who supplies each product, and a full history of stock movements. All data is stored locally in the browser, so the app works completely offline once loaded.

## Main Features

- **Dashboard** — total products, total stock units, low stock alerts, out-of-stock counts, total inventory value, and a feed of recent inventory activity
- **Product management** — add, edit, delete, search, filter by category/status, and sort products by name, stock, or price
- **Automatic stock status** — products are automatically classified as In Stock, Low Stock, or Out of Stock based on their reorder level
- **Stock movements** — record Stock In and Stock Out events with a quantity and reason; product stock updates automatically
- **Supplier management** — add, edit, and delete suppliers, with a live count of products linked to each one
- **Reports** — inventory summary by category, a dedicated low stock report, and a full stock movement history
- **Polished UX details** — modal forms, confirmation dialogs before destructive actions, toast notifications, empty states, and a responsive sidebar layout

## Technologies Used

- HTML5
- CSS3 (custom properties, CSS Grid & Flexbox, no framework)
- Vanilla JavaScript (ES6+)
- Browser `localStorage` for persistence
- Google Fonts (Inter, JetBrains Mono) via CDN — the app still functions if the font fails to load
- Inline SVG icons (no icon library)

No backend, server, database, or build tools are required.

## How to Run

1. Download or clone this repository.
2. Open `index.html` directly in any modern web browser (Chrome, Firefox, Edge, Safari).
3. That's it — no installation, no build step, no server needed.

Sample data is loaded automatically the first time you open the app. All changes you make (adding products, recording stock movements, editing suppliers, etc.) are saved to your browser's `localStorage` and will still be there the next time you open `index.html`.

## Project Structure

```
stockflow/
├── index.html      # Application markup and modal templates
├── style.css       # All styling, layout, and responsive rules
├── script.js       # Application state, rendering, and event logic
└── README.md       # This file
```

## Key Functionality

| Area | What it does |
|---|---|
| Dashboard | Aggregates live figures from the product and activity data on every render |
| Products | Full CRUD, with combined search + category + status filtering and multi-field sorting |
| Stock In / Stock Out | Adjusts a product's stock and appends a timestamped entry to the activity log |
| Suppliers | Full CRUD; deleting a supplier that is still linked to a product is blocked with a toast warning |
| Reports | Derived views computed on demand from the same underlying product/activity data — nothing is duplicated in storage |

## Screenshots

> _Add screenshots of your running application here._

- `screenshots/dashboard.png` — Dashboard overview
- `screenshots/products.png` — Product catalog with filters
- `screenshots/activity.png` — Inventory activity log
- `screenshots/suppliers.png` — Supplier directory
- `screenshots/reports.png` — Reports view

## Future Improvements

- Export reports to CSV/PDF
- Barcode scanning support for stock adjustments
- Multi-warehouse / multi-location stock tracking
- Role-based views (e.g. read-only staff accounts)
- Low stock email/notification reminders (would require a backend service)
