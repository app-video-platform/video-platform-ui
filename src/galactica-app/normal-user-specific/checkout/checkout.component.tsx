/* eslint-disable indent */
import React from 'react';
import { useSelector } from 'react-redux';
import { FaPaypal } from 'react-icons/fa';
import { FaGooglePay } from 'react-icons/fa';
import { FaApplePay } from 'react-icons/fa';
import { FaCreditCard } from 'react-icons/fa';

import {
  selectAllShopCartProducts,
  selectShopCartTotal,
} from '../../../store/shop-cart/shop-cart.selectors';
import GalExpansionPanel from '../../../components/gal-expansion-group/gal-expansion-panel/gal-expansion-panel.component';
import GalExpansionGroup from '../../../components/gal-expansion-group/gal-expansion-group.component';
import { GalIcon } from '@shared/ui';

import './checkout.styles.scss';

const Checkout: React.FC = () => {
  const cartProducts = useSelector(selectAllShopCartProducts);
  const cartTotal = useSelector(selectShopCartTotal);
  const [method, setMethod] = React.useState<string | null>('paypal');

  const counts = cartProducts.reduce(
    (acc, p) => {
      switch (p.type) {
        case 'COURSE':
          acc.courses += 1;
          break;
        case 'DOWNLOAD':
          acc.packages += 1;
          break;
        case 'CONSULTATION':
          acc.sessions += 1;
          break;
        default:
          break;
      }
      return acc;
    },
    { courses: 0, packages: 0, sessions: 0 },
  );

  const parts: string[] = [];
  if (counts.courses) {
    parts.push(
      `${counts.courses} ${counts.courses === 1 ? 'course' : 'courses'}`,
    );
  }
  if (counts.packages) {
    parts.push(
      `${counts.packages} ${counts.packages === 1 ? 'package' : 'packages'}`,
    );
  }
  if (counts.sessions) {
    parts.push(
      `${counts.sessions} ${counts.sessions === 1 ? 'session' : 'sessions'}`,
    );
  }

  const summary = parts.length > 0 ? parts.join(', ') : 'No products in cart';

  if (!cartProducts || cartProducts.length === 0) {
    return (
      <div className="checkout-page">
        <p>You don&apos;t have any products in your cart</p>
      </div>
    );
  }

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>
      <div className="checkout-grid">
        <div className="checkout-order-details">
          <h2>Payment Method</h2>
          <GalExpansionGroup
            mode="radio"
            value={method}
            onValueChange={setMethod}
            accordion
            name="checkout-payment-method"
          >
            <GalExpansionPanel
              value="paypal"
              header={
                <div className="pm-header">
                  {/* <PaypalIcon className="pm-icon" /> */}
                  <GalIcon icon={FaPaypal} size={18} />
                  <span>PayPal</span>
                </div>
              }
            >
              <div className="pm-body">
                <p>
                  You&apos;ll be redirected to PayPal to complete your purchase.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    /* redirect */
                  }}
                >
                  Continue to PayPal
                </button>
              </div>
            </GalExpansionPanel>

            <GalExpansionPanel
              value="applepay"
              header={
                <div className="pm-header">
                  {/* <ApplePayIcon className="pm-icon" /> */}
                  <GalIcon icon={FaApplePay} size={32} />

                  <span>Apple&nbsp;Pay</span>
                </div>
              }
            >
              <div className="pm-body">
                <p>Use Apple Pay on supported devices and browsers.</p>
                <button
                  type="button"
                  onClick={() => {
                    /* trigger Apple Pay */
                  }}
                >
                  Pay with Apple Pay
                </button>
              </div>
            </GalExpansionPanel>

            <GalExpansionPanel
              value="card"
              header={
                <div className="pm-header">
                  {/* <CardIcon className="pm-icon" /> */}
                  <GalIcon icon={FaCreditCard} size={18} />
                  <span>Credit / Debit Card</span>
                </div>
              }
            >
              <form
                className="pm-body"
                onSubmit={(e) => {
                  e.preventDefault(); /* tokenize + submit */
                }}
              >
                <div className="row">
                  <label>
                    Card number
                    <input
                      inputMode="numeric"
                      autoComplete="cc-number"
                      placeholder="1234 5678 9012 3456"
                    />
                  </label>
                </div>
                <div className="row">
                  <label>
                    Expiry
                    <input
                      inputMode="numeric"
                      autoComplete="cc-exp"
                      placeholder="MM/YY"
                    />
                  </label>
                  <label>
                    CVC
                    <input
                      inputMode="numeric"
                      autoComplete="cc-csc"
                      placeholder="CVC"
                    />
                  </label>
                </div>
                <button type="submit">Pay now</button>
              </form>
            </GalExpansionPanel>

            <GalExpansionPanel
              value="googlepay"
              header={
                <div className="pm-header">
                  {/* <ApplePayIcon className="pm-icon" /> */}
                  <GalIcon icon={FaGooglePay} size={32} />

                  <span>Google&nbsp;Pay</span>
                </div>
              }
            >
              <div className="pm-body">
                <p>Use Google Pay on supported devices and browsers.</p>
                <button
                  type="button"
                  onClick={() => {
                    /* trigger Apple Pay */
                  }}
                >
                  Pay with Apple Pay
                </button>
              </div>
            </GalExpansionPanel>
          </GalExpansionGroup>
        </div>
        <aside className="checkout-order-summary">
          <h2>Order summary</h2>
          <h4>
            Order details{' '}
            <span className="order-products-summary">({summary})</span>
          </h4>
          <div className="checkout-products-list">
            {cartProducts &&
              cartProducts.map((prod) => (
                <div className="checkout-product" key={prod.id}>
                  <div className="checkout-product-details">
                    <p className="checkout-product-name">{prod.name}</p>
                    <p>{prod.createdByName}</p>
                    <p>{prod.type}</p>
                  </div>
                  <div className="product-price">
                    <span>{prod.price}</span>
                  </div>
                </div>
              ))}
          </div>
          <hr></hr>
          <div className="checkout-price-container">
            <p>Total</p>
            <span>{cartTotal}</span>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;
