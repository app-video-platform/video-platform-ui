# Creator Data Frontend Contracts

Phase 08B introduces frontend API contracts for Creator Customers and Creator Sales.
Phase 08C adds aggregate read-model contracts for Creator Analytics and Creator Dashboard.
Phase 08D adds Storefront public read-model and Creator configuration contracts.

These endpoint paths are proposed frontend contracts following current frontend conventions. They may need backend coordination before production implementation, but the use cases and data shapes represent current frontend requirements.

## Customers

### BACKEND CONTRACT NOT YET IMPLEMENTED: Customers Page

- Feature/use case: Creator Customers list
- Method: `GET`
- Proposed path: `api/creator/customers`
- Query shape: `CreatorCustomersQuery`
- Query fields: `page`, `pageSize`, `search`, `status`, `product`, `membership`, `sort`
- Response shape: `CreatorCustomersPage`
- Frontend service: `getCreatorCustomersPageAPI(query)`
- Frontend consumer: `customers-store`, `CustomersList`
- Current backend status: pending

The response includes a paged `content` array of `CreatorCustomerListItem` plus `productOptions` for the product filter.

### BACKEND CONTRACT NOT YET IMPLEMENTED: Customer Detail

- Feature/use case: Creator Customer detail
- Method: `GET`
- Proposed path: `api/creator/customers/:customerId`
- Query/request shape: `customerId`
- Response shape: `CreatorCustomerDetail`
- Frontend service: `getCreatorCustomerDetailAPI(customerId)`
- Frontend consumer: `customers-store`, `CustomerDetail`
- Current backend status: pending

The detail response supports currently rendered read-only profile, relationship, summary metrics, products, purchases, access records, tags, notes, and recent activity.

## Sales

### BACKEND CONTRACT NOT YET IMPLEMENTED: Sales Summary

- Feature/use case: Creator Sales summary metrics
- Method: `GET`
- Proposed path: `api/creator/sales/summary`
- Query shape: `CreatorSalesSummaryQuery`
- Query fields: `period`
- Response shape: `CreatorSalesSummary`
- Frontend service: `getCreatorSalesSummaryAPI(query)`
- Frontend consumer: `sales-store`, `SalesPage`
- Current backend status: pending

The summary response supports Revenue, Orders, Refunds, Failed payments, and comparison/trend metadata for the selected period.

### BACKEND CONTRACT NOT YET IMPLEMENTED: Orders Page

- Feature/use case: Creator Sales order ledger
- Method: `GET`
- Proposed path: `api/creator/orders`
- Query shape: `CreatorOrdersQuery`
- Query fields: `page`, `pageSize`, `search`, `status`, `product`, `period`, `sort`
- Response shape: `CreatorOrdersPage`
- Frontend service: `getCreatorOrdersPageAPI(query)`
- Frontend consumer: `sales-store`, `SalesPage`
- Current backend status: pending

The response includes a paged `content` array of `SalesOrderListItem` plus `productOptions` for the product filter.

### BACKEND CONTRACT NOT YET IMPLEMENTED: Order Detail

- Feature/use case: Creator Sales order detail Drawer
- Method: `GET`
- Proposed path: `api/creator/orders/:orderId`
- Query/request shape: `orderId`
- Response shape: `SalesOrderDetail`
- Frontend service: `getCreatorOrderDetailAPI(orderId)`
- Frontend consumer: `sales-store`, `SalesPage`
- Current backend status: pending

The detail response supports payment information, order summary rows, access result, subscription/renewal context, refund detail on the original order, and failure context. Refunds are not represented as a separate top-level Creator ledger entity.

## Analytics

### BACKEND CONTRACT NOT YET IMPLEMENTED: Analytics Overview

- Feature/use case: Creator Analytics aggregate overview
- Method: `GET`
- Proposed path: `api/creator/analytics/overview`
- Query shape: `CreatorAnalyticsOverviewQuery`
- Query fields: `period`
- Supported periods: `7d`, `30d`, `90d`
- Response shape: `CreatorAnalyticsOverview`
- Frontend service: `getCreatorAnalyticsOverviewAPI(query)`
- Frontend consumer: `analytics-store`, `CreatorAnalytics`
- Current backend status: pending

The response is a UI-ready aggregate reporting read model. It includes summary metrics, revenue and order time series, product performance, customer growth, membership health, and payment health for the selected period. The backend should compose this read model from authoritative Sales/Orders, Customers, Product, and future Membership/Subscription sources rather than requiring the frontend to download raw events and aggregate them in React.

## Dashboard

### BACKEND CONTRACT NOT YET IMPLEMENTED: Dashboard Summary

- Feature/use case: Creator Dashboard aggregate summary
- Method: `GET`
- Proposed path: `api/creator/dashboard/summary`
- Query/request shape: none
- Response shape: `CreatorDashboardSummary`
- Frontend service: `getCreatorDashboardSummaryAPI()`
- Frontend consumer: `dashboard-store`, `CreatorDashboard`
- Current backend status: pending

Dashboard is a backend-composed aggregate surface. The response includes KPI metrics, recent activity, top products, and needs-attention items with explicit destination metadata where navigation is supported. The current UI renders the metric label `Sales`; Sales/Orders remains the authoritative financial backend domain for revenue, orders, refunds, and failed payments.

## Public Storefront

### BACKEND CONTRACT NOT YET IMPLEMENTED: Public Storefront

- Feature/use case: Buyer-facing Creator Storefront
- Method: `GET`
- Proposed path: `api/storefronts/:creatorId`
- Path params: `creatorId`
- Query/request shape: none
- Response shape: `PublicStorefront`
- Frontend service: `getPublicStorefrontAPI(creatorId)`
- Frontend consumer: `storefront-store`, `StorefrontPage`
- Current backend status: pending

The response is a public, read-only Storefront read model for `/app/store/:creatorId`. It embeds the public Creator presentation fields and ordered public products needed by the shared Storefront presentation. The backend should ultimately enforce visibility and return only public products; the frontend still defensively filters to `PUBLISHED` where the shared view model benefits from it.

## Creator Storefront Config

### BACKEND CONTRACT NOT YET IMPLEMENTED: Creator Storefront Config

- Feature/use case: Authenticated Creator Storefront management
- Method: `GET`
- Proposed path: `api/creator/storefront`
- Query/request shape: none
- Response shape: `CreatorStorefrontConfig`
- Frontend service: `getCreatorStorefrontConfigAPI()`
- Frontend consumer: `storefront-store`, `CreatorStorefrontPage`
- Current backend status: pending

The response contains Storefront-owned configuration only: `featuredProductId` and `productOrderIds`. User/Profile remains authoritative for profile fields such as name, title, bio, website, socials, and avatar. Product remains authoritative for Creator product identity, type, status, price, and thumbnails.

### BACKEND CONTRACT NOT YET IMPLEMENTED: Update Creator Storefront Config

- Feature/use case: Persist featured product and product ordering
- Method: `PATCH`
- Proposed path: `api/creator/storefront`
- Request shape: `CreatorStorefrontConfigUpdateRequest`
- Request fields: `featuredProductId`, `productOrderIds`
- Response shape: `CreatorStorefrontConfig`
- Frontend service: `updateCreatorStorefrontConfigAPI(payload)`
- Frontend consumer: `storefront-store`, `CreatorStorefrontPage`
- Current backend status: pending

The current frontend scope does not define page-builder, theme, font, layout-block, custom-domain, SEO, or Storefront analytics contracts.

## Upcoming Phase 08 Work

Membership contracts are intentionally out of scope for Phases 08B, 08C, and 08D.
