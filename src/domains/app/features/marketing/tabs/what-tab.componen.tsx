import React from 'react';

import { PageHeader } from 'domains/app/components';

const WhatTab: React.FC = () => (
  <div>
    <PageHeader
      title="What's happening"
      subTitle="This is a reminder of what needs to be implenented in the app"
    />

    <h1>Welcome to Galactica</h1>
    <p>Your one-stop solution for managing your online business.</p>
    <p>Explore our features and start your journey today!</p>
    <button className="cta-button">Get Started</button>

    <h1>Page details</h1>

    <div className="section">
      <h2>📧 1. Email Campaigns</h2>
      <h3>📌 What it is:</h3>
      <p>
        Creators send targeted emails to promote their products, inform
        subscribers, or update past customers. This can be manual or automated.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>
          <strong>Email Composer UI:</strong>
          <ul>
            <li>Subject line</li>
            <li>Rich text editor (WYSIWYG) for message body</li>
            <li>Product links, images, buttons</li>
          </ul>
        </li>
        <li>
          <strong>Audience Selection:</strong> All past buyers, only course
          customers, new subscribers, etc.
        </li>
        <li>
          <strong>Scheduling & Automation:</strong> Send now or schedule later.
          Optional automation sequences.
        </li>
        <li>
          <strong>Email Analytics:</strong> Open rate, click-through rate,
          unsubscribes
        </li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>New Campaign</li>
        <li>Audience Segmentation</li>
        <li>Email Preview</li>
        <li>Scheduled Campaigns List</li>
      </ul>
    </div>

    <div className="section">
      <h2>🎟️ 2. Coupons</h2>
      <h3>📌 What it is:</h3>
      <p>
        Creators offer discount codes to encourage purchases or reward loyal
        followers.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>
          <strong>Create/Edit Coupon:</strong>
          <ul>
            <li>Code: SUMMER20</li>
            <li>Type: % off or fixed amount (e.g., $10 off)</li>
            <li>Expiry date, usage limits, per-customer limits</li>
            <li>Applies to: all products, specific product(s), bundles</li>
          </ul>
        </li>
        <li>
          <strong>Manage Coupons:</strong>
          <ul>
            <li>List of active/inactive coupons</li>
            <li>Usage stats (how many times redeemed, by who)</li>
          </ul>
        </li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>Create Coupon form</li>
        <li>Table of active/inactive coupons</li>
        <li>Quick toggle to enable/disable</li>
      </ul>
    </div>

    <div className="section">
      <h2>
        🤝 3. Affiliate Program <strong>(Later)</strong>
      </h2>
      <h3>📌 What it is:</h3>
      <p>
        A system where creators recruit affiliates to promote their products.
        Affiliates earn a commission for every sale made through their unique
        link.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>
          <strong>Invite Affiliates:</strong> Creator shares signup link or
          invites by email
        </li>
        <li>
          <strong>Affiliate Dashboard:</strong>
          <ul>
            <li>Unique referral link</li>
            <li>Stats: clicks, conversions, commission earned</li>
          </ul>
        </li>
        <li>
          <strong>Commission Rules:</strong> % commission per sale, optional
          per-product settings
        </li>
        <li>
          <strong>Creator Dashboard:</strong> List of affiliates, performance
          tracking
        </li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>Affiliate Overview</li>
        <li>Invite New Affiliate</li>
        <li>Set Commission Rates</li>
        <li>Track Commissions & Sales</li>
      </ul>
    </div>

    <div className="section">
      <h2>💬 4. Messages</h2>
      <h3>📌 What it is:</h3>
      <p>
        Allows creators to communicate directly with their buyers — either
        through a chat interface or a message inbox.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>Message inbox with thread view</li>
        <li>Rich text or basic message input</li>
        <li>Notifications for new messages</li>
        <li>Search messages by user or product</li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>Inbox View</li>
        <li>Chat Thread View</li>
        <li>New Message / Reply Interface</li>
      </ul>
    </div>

    <div className="section">
      <h2>🖊️ 5. Reviews</h2>
      <h3>📌 What it is:</h3>
      <p>
        Customers can leave feedback on purchased products. Reviews help build
        trust and give creators insights.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>Star rating (1–5)</li>
        <li>Optional written feedback</li>
        <li>Creator response to reviews</li>
        <li>Moderation tools (hide/report review)</li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>Leave a Review Form</li>
        <li>Reviews List (by product)</li>
        <li>Review Moderation Panel</li>
      </ul>
    </div>

    <div className="section">
      <h2>🗓️ 6. Live Sessions / Bookings</h2>
      <h3>📌 What it is:</h3>
      <p>
        1:1 consultation sessions booked by customers. Creators can manage
        availability and accept bookings.
      </p>

      <h3>✅ Key Features:</h3>
      <ul>
        <li>Booking calendar with available time slots</li>
        <li>Session confirmation + reminder system</li>
        <li>Link to join session (e.g., Zoom)</li>
        <li>Reschedule / Cancel options</li>
      </ul>

      <h3>🔧 Example UI Screens:</h3>
      <ul>
        <li>Booking Calendar UI</li>
        <li>Upcoming Sessions List</li>
        <li>Session Detail / Join Page</li>
      </ul>
    </div>
  </div>
);

export default WhatTab;
