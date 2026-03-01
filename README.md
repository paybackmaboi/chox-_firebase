# CHOX Kitchen - Online Ordering System Management Guide

Welcome to the **CHOX Kitchen Online Ordering System**. This document provides an overview of the system's features and instructions for managing your restaurant operations.

## 🚀 System Overview

This application is a complete solution for managing online food orders, inventory, and menus, featuring a premium "Dark/Gold" aesthetic for a professional brand experience.

-   **Customer App:** Allows customers to browse the menu, place orders, and track them in real-time.
-   **Admin Panel:** A powerful dashboard for you to manage sales, orders, stock, and the menu.

---

## 🔐 Admin Access

To access the management dashboard, you must log in with an authorized admin account.

-   **Admin Login Portal:** `https://your-app-url.com/admin/signin`
    -   Use this link to sign in to your dashboard.

### ⚠️ Creating New Admin Accounts (Private)

To create a NEW admin account, you must access the **secret registration page**. This page is hidden from the public to prevent unauthorized registrations.

-   **Secret Registration URL:** `/admin/secret-register-99`
    -   **Full Link:** `https://your-app-url.com/admin/secret-register-99`
    -   **Action:** Visit this link to register a new admin email and password. Once created, you will be redirected to the dashboard.

> **Note:** Share this secret link ONLY with trusted personnel.

---

## 🛠️ Admin Features

Once logged in, you will have access to the following modules:

### 1. 📊 Sales Reports
-   View total revenue and order counts.
-   See sales trends over time (Daily/Monthly/Yearly) with interactive charts.
-   **Note:** Only **Completed** orders are counted towards revenue.

### 2. 📦 Order Management
-   View all incoming orders in real-time.
-   **Actions:**
    -   **View Details:** Click an Order ID to see customer info, items, and totals.
    -   **Update Status:** Move orders from `Pending` → `Preparing` → `Ready` → `On the Way` → `Delivered`.
    -   **Print Receipt:** Generate a printable receipt for the kitchen or delivery.

### 3. 📋 Inventory & Logs
-   Track stock levels for your ingredients/items.
-   **Add Stock:** Use the **"Add Item"** button to register new inventory.
-   **Logs:** View a history of all stock-in and stock-out actions for accountability.

### 4. 🍽️ Menu Management
-   **Update Menu:** Add, edit, or remove dishes from your online menu instantly.
-   **Images:** Upload photos directly for each dish.
-   **Categories:** Organize items (e.g., "Main Course", "Beverages").
-   **Stock Control:** Mark items as "Out of Stock" to hide them from customers.

### 5. ⚙️ Account Settings
-   Update your admin profile name.
-   Change your secure password.

---

## 📱 Customer Features
-   **Menu Browsing:** Beautiful categorized menu with search.
-   **Cart & Checkout:** Easy ordering process.
-   **Order Tracking:** a URL is generated for each order (e.g., `/track/ORDER_ID`) allowing customers to see live status updates on a map-like timeline.

---

## ❓ Need Help?
If you encounter issues or need support with the system, please contact your technical administrator.
