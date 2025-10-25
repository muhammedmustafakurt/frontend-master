# E-commerce Header Component

A responsive e-commerce header component built for a car parts marketplace using Next.js (App Router) and Tailwind CSS.

## Features

### Top Bar
- Customer service contact info (left side)
- Quick links: "Mağaza Girişi", "Kargo Takip", "Yardım" (right side)

### Main Header
- **Logo**: "AutoParts" text logo (left side)
- **Advanced Search Bar** (center):
  - Car brand dropdown (Araç Markası)
  - Model dropdown (dynamically populated based on brand)
  - Year dropdown (Yıl)
  - Search input with placeholder
  - Search button with icon
- **Right Icons**:
  - Account/User icon
  - Compare list with item count badge
  - Favorites/Wishlist with item count badge
  - Shopping cart with item count badge
  - Language selector (TR/EN)

### Bottom Navigation
- **Mega Menu** with car parts categories:
  - Motor & Mekanik
  - Fren Sistemi
  - Elektrik & Aydınlatma
  - Yağ & Filtre
  - Yedek Parça Kampanyaları
- Hover dropdowns with subcategories

### Mobile Responsive
- Hamburger menu for mobile navigation
- Full-width mobile search bar
- Collapsible mobile menu with categories
- All icons remain visible on mobile

## Usage

```tsx
import Header from '@/components/Header';

export default function Layout() {
  return (
    <div>
      <Header />
      {/* Your page content */}
    </div>
  );
}
```

## Demo

Visit `/demo` to see the header component in action with sample content.

## Styling

- **Theme**: Black & white minimal design
- **Framework**: Tailwind CSS only (no external UI kits)
- **Icons**: Custom SVG icons (no external dependencies)
- **Responsive**: Mobile-first design with breakpoints

## Dummy Data

The component includes dummy data for:
- Car brands (Audi, BMW, Mercedes-Benz, etc.)
- Car models (organized by brand)
- Years (2000-2024)
- Product categories and subcategories

## State Management

The component uses React hooks for:
- Mobile menu toggle
- Search form state
- Category hover states
- Dropdown selections

## Customization

To customize the component:
1. Update the dummy data arrays
2. Modify the styling classes
3. Add your own search logic in the `handleSearch` function
4. Replace the logo with your own brand
