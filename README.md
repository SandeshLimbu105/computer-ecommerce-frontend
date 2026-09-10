# Core Parts — React Frontend

Professional PC-parts storefront UI built on the supplied Spring Boot backend.

## Stack

- React 19
- Vite 7
- React Router
- Axios
- Bootstrap 5 + Bootstrap Icons

## Run locally

The supplied Vite config proxies `/api` to the existing Spring Boot backend at `http://localhost:8080`.

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

## Production build

```bash
npm run build
npm run preview
```

For a separately hosted frontend, set:

```env
VITE_API_BASE_URL=http://your-backend-host:8080/api
```

## Product images

The frontend preserves the backend's existing `Product.imageUrl` field. When a product has an image URL, that image is used everywhere: cards, details, cart and admin preview.

When `imageUrl` is empty, the frontend uses a professional PC-hardware category fallback image rather than a generic placeholder. This keeps older database records visually usable without changing the database schema.

For new products, the admin product form accepts a direct image URL and shows a live preview.

## Existing eSewa flow

The checkout and payment routes were intentionally left intact. The frontend continues to call:

`POST /api/payments/esewa/initiate/{orderId}`

and submits the returned signed fields to the `paymentUrl` supplied by the existing backend eSewa service.

No eSewa backend/payment files were changed as part of the UI work. The eSewa Sandbox CAPTCHA limitation can prevent completing a real sandbox transaction during testing, but the existing checkout → eSewa redirect path is preserved.

## Backend assumptions

The frontend expects the supplied backend API routes, authentication contract, product DTO, category DTO, cart/order endpoints, reviews, recommendations, admin endpoints and existing payment endpoints.

No new backend API is required for the UI improvements.
