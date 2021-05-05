# vanilla-store

Basic Vanilla JS eMail registry, uses arrays as source of truth between local storage and DOM. Running on Vite with Tailwind. Revolving around two central render function so far: writeAddressListToDom() and writeFilterListToDom(). These reflect the state of the array within the DOM.

**Current functionality:**

- Can validate and add eMail addresses
- Displays error message correctly
- The gradient looks almost exactly as in the mockups
- Can filter with existing, editable 'contains'/'does not contain' filters
- Uses DOM Fragments for more efficient writes
- Uses IndexedDB for persistent local browser storage
- Maintainable responsive CSS with Tailwind
- Managed to get codesandbox working with Node 14
- Mostly async arrow functions, which has 'asyncified' the entire app
- Having an SVG logo is a big win for humanity

**Currently unfinished functionality (work delayed due to vaccine side-effects):**

- Cannot retain filter state with character counts less than 1
- Cannot delete eMail addresses and filters
- Cannot add new filters through interface, has to be configured at main.js:8

_The functional scaffolding for implementing these functionalities is already written_

**API Limits**

Trumail.io seems to have a very low threshold for rate limiting, be that because of gmail or the API server itself. I had to reload and reconnect through a VPN often, which points towards the API server itself in this matter.

**Tests**

Tests are sketched out in main.js (written in pseudocode) for most of the testworthy (imho) functions.

**AND/OR**

Solutions for filtering addressList with an ordered chain of expressions containing an arbitrary number of AND/OR string filters:

1. Rewrite filterAddressList() to use addressList.filter(expression1 && expression2 || expression 3 || expression4 && expression 5)

2. Run filterAddressList() for all &&-linked filter expressions (grouped up through a for-loop with groupCount++ for every new || expression), then concat() all resulting arrays

The first solution might not actually be faster in all browsers, esp. those not running on V8/Chromium, since it relies on a browser-specific implementation of the new ES spec feature filter()
