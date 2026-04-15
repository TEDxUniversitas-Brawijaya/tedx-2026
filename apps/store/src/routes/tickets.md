
# TICKETS FRONTEND

## **Assets that are going to be used**
``../assets/stage.png`` and ``../assets/people.png``


## **Flow**
1. Ticket storefront has hero text ``Selamat datang dalam perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!`` and ``stage.png`` is ``w-full`` and ``h-full`` and the storefront has a left to right gradient of black to transparent, lets call the hero ``ticket-hero-text``, the background of the storefront will be paper-texture-1.
2. ``stage`` slightly translate vertically, then ``people`` from the bottom (not being seen) it translates vertically going to ``bottom-0``.
3. Step 2 is achievable by scrolling through.
4. after Step 2, the hero text has transition opacity animation from ``Selamat datang dalam perjalanan bertumbuh bersama TEDxUniversitasBrawijaya 2026!`` to ``Di ruang ini, kamu tidak hanya datang untuk mendengar, tapi juga untuk membawa kisah dari perjalananmu. Cerita tentang tawa, luka, dan harapan yang kamu simpan, kini punya ruang untuk saling melengkapi dengan cerita lainnya. Mari ubah pengalaman pribadimu menjadi bagian dari sebuah rumah, tempat berbagai gagasan bertemu dan makna baru terbentuk.``
5. After that, user can scroll through and ``stage.png`` and ``people.png`` will be slightly zoomed in.
6. Scrolling through again, there will be a header ``Dapatkan tiket-mu di sini dan ambil bagian untuk menciptakan ruang bertumbuh kita bersama.``  and there will 2 tabs called ``Regular`` and ``Bundling``, these two tabs are interchangable animation-ly, the selected tab has rounded border with black color, and the backdrop color is using ``--color-gray-2`` as background of the two tabs with the same border radius as selected tab. 
7. Clicking ``regular`` has a section appears, lets call it ``ticket-regular`` and for ``bundling`` will be ``ticket-bundling``.
8. ``ticket-regular`` and ``ticket-bundling`` has cards, it has a container for the image to be placed and there will be 3 texts in the card. There will be probably a h2 tag for ticket/bundling name, then under the h2 tag, it is a date, at the very bottom will be the price of the tickets/bundling.
9. Cards are clickable and will appear a modal/dialog form for payment which you will possibly reuse from issue (P1,S1) . 

## **Technical Notes**
- Please wire the frontend and backend with the dummy tRPC procedures and tickets is using no cart (single product checkout).
- Make sure implement container and component pattern (as a reference please check ``merchandise`` or ``dashboard`` features).
- Please name the needed sections or components with a meaningful id
- Use skills for details for best practices.
- Please use ``zustand`` for particular cases for stores (if necessary)
- Key difference from merch: no cart, single product per order, max 5 quantity, stock display, bundle selectable items.
- Reuse checkout dialog and payment UI from P1.S1 if possible.
- See PRD.md US-T01, US-T02.

## **Where**
- apps/store — pages, components (reuse from merch where possible)
- packages/api — Zod schemas, tRPC router (ticket.*)