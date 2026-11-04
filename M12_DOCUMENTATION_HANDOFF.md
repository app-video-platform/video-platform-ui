# M12 accessibility documentation handoff

These changes are frontend-only. Update the corresponding Docusaurus component and QA guidance after review; this handoff does not change the docs site.

- **BUG-038:** Shared Drawer assigns instance-specific title IDs and uses one stack to manage layering, Escape, focus trapping and restoration, and the body scroll lock. The top Drawer owns interaction; closing it returns focus inside the remaining Drawer when possible. The final close restores the prior scroll state and trigger focus. Consumers include Sales, Product Builder and Settings.
- **BUG-062:** Shared Input forwards native `disabled` and `readOnly` states. Disabled Settings Profile email and social-prefix controls are skipped in keyboard navigation; read-only controls retain native focus behavior.
- **BUG-015:** Creator sidebar links and the disabled Help control retain their existing labels as accessible names when collapsed. Active route behavior is unchanged.
- **BUG-016:** Account menu Logout is a native keyboard-operable button using the existing session/logout flow.
- **BUG-017:** Shared Textarea associates its visible label and validation message with an instance-specific field ID, including the Landing Page Builder Marketing description.
- **BUG-022:** Notifications has a named button with expanded state and a reference to its open popup.
- **BUG-027:** Cart, Wishlist and Notifications dropdowns and the legacy Course expansion panel use dark theme surfaces and readable theme text. Course article rendering and sanitization are unchanged. Verify contrast in all supported visual states when changing these tokens.
- **BUG-045:** Notifications with `isRead: false` display an explicit textual Unread marker. Existing ordering and session-local state are unchanged; there is no new read control, delivery, or persistence.

## QA guidance and limitations

Automated tests cover stacked Drawer identity, Escape, focus boundaries/restoration, scroll cleanup and StrictMode; native input semantics; sidebar names; keyboard Logout with mocked dispatch; textarea labels; notification state; and Course panel region naming. Existing suite coverage exercises the affected consumers. Synthetic browser checks covered the collapsed sidebar, a Sales order Drawer and Escape/focus restoration, Settings disabled states, and keyboard opening of the account menu. The full Sales Order + Filters overlap, populated and empty menu contrast, notification states, Landing Builder, and Course Article contrast still need browser verification with appropriate synthetic fixtures. Token-pair contrast calculations are not computed-style tests and do not establish full WCAG compliance. No manual screen-reader audit was performed; axe is not installed as a project dependency.

Suggested docs/QA updates: describe the Drawer ownership and focus contract, native form states, icon-only names, keyboard Logout, the theme surfaces used for these menus and Course content, and the presentation-only unread marker. Include keyboard and assistive-technology checks in the accessibility regression matrix without claiming unsupported backend behavior.
