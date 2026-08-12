# Creator Data Frontend Contracts

Phase 08B introduces frontend API contracts for Creator Customers and Creator Sales.

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

## Upcoming Phase 08 Work

Analytics, Dashboard, Storefront, and Membership contracts are intentionally out of scope for Phase 08B.
