import { TRPCError } from "@trpc/server";
import {
  getOrderByIdInputSchema,
  getOrderByIdOutputSchema,
  listOrdersInputSchema,
  listOrdersOutputSchema,
  processRefundInputSchema,
  processRefundOutputSchema,
  verifyPaymentInputSchema,
  verifyPaymentOutputSchema,
  verifyPaymentOutputSchema,
} from "../../schemas/order";
import { createTRPCRouter, protectedProcedure } from "../../trpc";

const seededOrderDetails = [
  {
    id: "TDX-260401-A1B2C",
    type: "ticket",
    status: "paid",
    buyerName: "Andi Saputra",
    buyerEmail: "andi.saputra@example.com",
    buyerPhone: "081234567890",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 150_000,
    idempotencyKey: "idem-001",
    expiresAt: "2026-04-01T08:20:00.000Z",
    paidAt: "2026-04-01T08:05:00.000Z",
    createdAt: "2026-04-01T08:00:00.000Z",
    updatedAt: "2026-04-01T08:05:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-001",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: "ref-token-001",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_001",
        productId: "prod_ticket_main_event",
        quantity: 1,
        snapshotName: "Main Event Ticket",
        snapshotPrice: 150_000,
        snapshotType: "ticket_regular",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_001",
        qrCode: "qr-main-001",
        eventDay: "main_event",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: null,
  },
  {
    id: "TDX-260401-D4E5F",
    type: "ticket",
    status: "pending_payment",
    buyerName: "Bunga Larasati",
    buyerEmail: "bunga.larasati@example.com",
    buyerPhone: "081398765432",
    buyerCollege: "Politeknik Negeri Malang",
    totalPrice: 220_000,
    idempotencyKey: "idem-002",
    expiresAt: "2026-04-01T10:30:00.000Z",
    paidAt: null,
    createdAt: "2026-04-01T10:10:00.000Z",
    updatedAt: "2026-04-01T10:10:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-002",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: null,
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_002",
        productId: "prod_ticket_bundle_main_propa",
        quantity: 1,
        snapshotName: "Main Event + Propaganda Bundle",
        snapshotPrice: 220_000,
        snapshotType: "ticket_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_002",
        qrCode: "qr-main-002",
        eventDay: "main_event",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
      {
        id: "tkt_003",
        qrCode: "qr-propa-003",
        eventDay: "propa3_day1",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: null,
  },
  {
    id: "TDX-260402-G6H7I",
    type: "merch",
    status: "paid",
    buyerName: "Cahya Putri",
    buyerEmail: "cahya.putri@example.com",
    buyerPhone: "081255566677",
    buyerCollege: "Universitas Negeri Malang",
    totalPrice: 360_000,
    idempotencyKey: "idem-003",
    expiresAt: "2026-04-02T09:20:00.000Z",
    paidAt: "2026-04-02T09:08:00.000Z",
    createdAt: "2026-04-02T09:00:00.000Z",
    updatedAt: "2026-04-02T09:08:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/temp/proof-003.jpg",
    verifiedBy: "user_admin_01",
    verifiedAt: "2026-04-02T09:10:00.000Z",
    rejectionReason: null,
    refundToken: "ref-token-003",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_003",
        productId: "prod_workshirt_2",
        quantity: 1,
        snapshotName: "Workshirt 2",
        snapshotPrice: 175_000,
        snapshotType: "merch_regular",
        snapshotVariants: [{ type: "size", label: "L" }],
      },
      {
        id: "oi_004",
        productId: "prod_keychain_2",
        quantity: 1,
        snapshotName: "Keychain 2",
        snapshotPrice: 30_000,
        snapshotType: "merch_regular",
        snapshotVariants: [{ type: "color", label: "Black" }],
      },
      {
        id: "oi_005",
        productId: "prod_shirt_2",
        quantity: 1,
        snapshotName: "Shirt 2",
        snapshotPrice: 155_000,
        snapshotType: "merch_regular",
        snapshotVariants: [{ type: "size", label: "L" }],
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260402-J8K9L",
    type: "merch",
    status: "pending_verification",
    buyerName: "Dimas Prasetyo",
    buyerEmail: "dimas.prasetyo@example.com",
    buyerPhone: "081222233344",
    buyerCollege: "Universitas Airlangga",
    totalPrice: 248_000,
    idempotencyKey: "idem-004",
    expiresAt: "2026-04-02T13:20:00.000Z",
    paidAt: null,
    createdAt: "2026-04-02T13:00:00.000Z",
    updatedAt: "2026-04-02T13:05:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/temp/proof-004.jpg",
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: null,
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_006",
        productId: "prod_merch_bundle_4",
        quantity: 1,
        snapshotName: "Merch Bundle 4",
        snapshotPrice: 248_000,
        snapshotType: "merch_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260403-M1N2O",
    type: "ticket",
    status: "expired",
    buyerName: "Eka Maharani",
    buyerEmail: "eka.maharani@example.com",
    buyerPhone: "081212341212",
    buyerCollege: "Institut Teknologi Sepuluh Nopember",
    totalPrice: 95_000,
    idempotencyKey: "idem-005",
    expiresAt: "2026-04-03T07:20:00.000Z",
    paidAt: null,
    createdAt: "2026-04-03T07:00:00.000Z",
    updatedAt: "2026-04-03T07:25:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-005",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: null,
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_007",
        productId: "prod_ticket_propaganda",
        quantity: 1,
        snapshotName: "Propaganda Ticket",
        snapshotPrice: 95_000,
        snapshotType: "ticket_regular",
        snapshotVariants: null,
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260403-P3Q4R",
    type: "ticket",
    status: "refund_requested",
    buyerName: "Farhan Akbar",
    buyerEmail: "farhan.akbar@example.com",
    buyerPhone: "081356781234",
    buyerCollege: "Universitas Brawijaya",
    totalPrice: 150_000,
    idempotencyKey: "idem-006",
    expiresAt: "2026-04-03T11:20:00.000Z",
    paidAt: "2026-04-03T11:06:00.000Z",
    createdAt: "2026-04-03T11:00:00.000Z",
    updatedAt: "2026-04-05T09:10:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-006",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: "ref-token-006",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_008",
        productId: "prod_ticket_main_event",
        quantity: 1,
        snapshotName: "Main Event Ticket",
        snapshotPrice: 150_000,
        snapshotType: "ticket_regular",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_004",
        qrCode: "qr-main-004",
        eventDay: "main_event",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: {
      id: "ref_001",
      status: "requested",
      reason: "Cannot attend the event.",
      paymentMethod: "midtrans",
      paymentProofUrl: null,
      bankAccountNumber: "1234567890",
      bankName: "BCA",
      bankAccountHolder: "Farhan Akbar",
      processedBy: null,
      processedAt: null,
      rejectionReason: null,
      createdAt: "2026-04-05T09:10:00.000Z",
    },
  },
  {
    id: "TDX-260404-S5T6U",
    type: "ticket",
    status: "refunded",
    buyerName: "Gita Amelia",
    buyerEmail: "gita.amelia@example.com",
    buyerPhone: "081399977766",
    buyerCollege: "Universitas Negeri Surabaya",
    totalPrice: 220_000,
    idempotencyKey: "idem-007",
    expiresAt: "2026-04-04T10:20:00.000Z",
    paidAt: "2026-04-04T10:08:00.000Z",
    createdAt: "2026-04-04T10:00:00.000Z",
    updatedAt: "2026-04-06T08:00:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/temp/proof-007.jpg",
    verifiedBy: "user_admin_03",
    verifiedAt: "2026-04-04T10:10:00.000Z",
    rejectionReason: null,
    refundToken: "ref-token-007",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_009",
        productId: "prod_ticket_bundle_main_propa",
        quantity: 1,
        snapshotName: "Main Event + Propaganda Bundle",
        snapshotPrice: 220_000,
        snapshotType: "ticket_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_005",
        qrCode: "qr-main-005",
        eventDay: "main_event",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
      {
        id: "tkt_006",
        qrCode: "qr-propa-006",
        eventDay: "propa3_day2",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: {
      id: "ref_002",
      status: "approved",
      reason: "Schedule conflict.",
      paymentMethod: "manual",
      paymentProofUrl:
        "https://cdn.tedxuniversitasbrawijaya.com/temp/ref-proof-002.jpg",
      bankAccountNumber: "2345678901",
      bankName: "Mandiri",
      bankAccountHolder: "Gita Amelia",
      processedBy: "user_superadmin_01",
      processedAt: "2026-04-06T08:00:00.000Z",
      rejectionReason: null,
      createdAt: "2026-04-06T07:30:00.000Z",
    },
  },
  {
    id: "TDX-260405-V7W8X",
    type: "merch",
    status: "paid",
    buyerName: "Hafiz Ramadhan",
    buyerEmail: "hafiz.ramadhan@example.com",
    buyerPhone: "081377733311",
    buyerCollege: "Universitas Bina Nusantara",
    totalPrice: 195_000,
    idempotencyKey: "idem-008",
    expiresAt: "2026-04-05T15:20:00.000Z",
    paidAt: "2026-04-05T15:07:00.000Z",
    createdAt: "2026-04-05T15:00:00.000Z",
    updatedAt: "2026-04-05T15:07:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-008",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: "ref-token-008",
    pickedUpAt: "2026-04-09T10:00:00.000Z",
    pickedUpBy: "user_admin_04",
    items: [
      {
        id: "oi_010",
        productId: "prod_merch_bundle_1",
        quantity: 1,
        snapshotName: "Merch Bundle 1",
        snapshotPrice: 195_000,
        snapshotType: "merch_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260406-Y9Z1A",
    type: "merch",
    status: "paid",
    buyerName: "Intan Permata",
    buyerEmail: "intan.permata@example.com",
    buyerPhone: "081311122233",
    buyerCollege: "Universitas Muhammadiyah Malang",
    totalPrice: 182_000,
    idempotencyKey: "idem-009",
    expiresAt: "2026-04-06T12:20:00.000Z",
    paidAt: "2026-04-06T12:09:00.000Z",
    createdAt: "2026-04-06T12:00:00.000Z",
    updatedAt: "2026-04-06T12:09:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/temp/proof-009.jpg",
    verifiedBy: "user_admin_05",
    verifiedAt: "2026-04-06T12:12:00.000Z",
    rejectionReason: null,
    refundToken: "ref-token-009",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_011",
        productId: "prod_merch_bundle_3",
        quantity: 1,
        snapshotName: "Merch Bundle 3",
        snapshotPrice: 182_000,
        snapshotType: "merch_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260407-B2C3D",
    type: "ticket",
    status: "paid",
    buyerName: "Joko Prabowo",
    buyerEmail: "joko.prabowo@example.com",
    buyerPhone: "081366655544",
    buyerCollege: "Universitas Indonesia",
    totalPrice: 95_000,
    idempotencyKey: "idem-010",
    expiresAt: "2026-04-07T09:20:00.000Z",
    paidAt: "2026-04-07T09:04:00.000Z",
    createdAt: "2026-04-07T09:00:00.000Z",
    updatedAt: "2026-04-07T09:04:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-010",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: "ref-token-010",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_012",
        productId: "prod_ticket_propaganda",
        quantity: 1,
        snapshotName: "Propaganda Ticket",
        snapshotPrice: 95_000,
        snapshotType: "ticket_regular",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_007",
        qrCode: "qr-propa-007",
        eventDay: "propa3_day1",
        attendanceStatus: "checked_in",
        checkedInAt: "2026-04-10T07:30:00.000Z",
        checkedInBy: "user_admin_06",
      },
    ],
    refund: null,
  },
  {
    id: "TDX-260408-E4F5G",
    type: "merch",
    status: "expired",
    buyerName: "Karina Putra",
    buyerEmail: "karina.putra@example.com",
    buyerPhone: "081388844422",
    buyerCollege: "Universitas Gadjah Mada",
    totalPrice: 30_000,
    idempotencyKey: "idem-011",
    expiresAt: "2026-04-08T14:20:00.000Z",
    paidAt: null,
    createdAt: "2026-04-08T14:00:00.000Z",
    updatedAt: "2026-04-08T14:21:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: null,
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_013",
        productId: "prod_keychain_4",
        quantity: 1,
        snapshotName: "Keychain 4",
        snapshotPrice: 30_000,
        snapshotType: "merch_regular",
        snapshotVariants: [{ type: "color", label: "Black" }],
      },
    ],
    tickets: [],
    refund: null,
  },
  {
    id: "TDX-260409-H6I7J",
    type: "ticket",
    status: "paid",
    buyerName: "Laila Nabila",
    buyerEmail: "laila.nabila@example.com",
    buyerPhone: "081355544433",
    buyerCollege: "Universitas Padjadjaran",
    totalPrice: 220_000,
    idempotencyKey: "idem-012",
    expiresAt: "2026-04-09T18:20:00.000Z",
    paidAt: "2026-04-09T18:07:00.000Z",
    createdAt: "2026-04-09T18:00:00.000Z",
    updatedAt: "2026-04-09T18:07:00.000Z",
    paymentMethod: "midtrans",
    midtransOrderId: "MID-012",
    proofImageUrl: null,
    verifiedBy: null,
    verifiedAt: null,
    rejectionReason: null,
    refundToken: "ref-token-012",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_014",
        productId: "prod_ticket_bundle_main_propa",
        quantity: 1,
        snapshotName: "Main Event + Propaganda Bundle",
        snapshotPrice: 220_000,
        snapshotType: "ticket_bundle",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_008",
        qrCode: "qr-main-008",
        eventDay: "main_event",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
      {
        id: "tkt_009",
        qrCode: "qr-propa-009",
        eventDay: "propa3_day2",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: null,
  },
  {
    id: "TDX-260410-K8L9M",
    type: "ticket",
    status: "refund_requested",
    buyerName: "Mira Oktaviani",
    buyerEmail: "mira.oktaviani@example.com",
    buyerPhone: "081344455566",
    buyerCollege: "Universitas Diponegoro",
    totalPrice: 95_000,
    idempotencyKey: "idem-013",
    expiresAt: "2026-04-10T13:20:00.000Z",
    paidAt: "2026-04-10T13:08:00.000Z",
    createdAt: "2026-04-10T13:00:00.000Z",
    updatedAt: "2026-04-11T08:40:00.000Z",
    paymentMethod: "manual",
    midtransOrderId: null,
    proofImageUrl:
      "https://cdn.tedxuniversitasbrawijaya.com/temp/proof-013.jpg",
    verifiedBy: "user_admin_02",
    verifiedAt: "2026-04-10T13:10:00.000Z",
    rejectionReason: null,
    refundToken: "ref-token-013",
    pickedUpAt: null,
    pickedUpBy: null,
    items: [
      {
        id: "oi_015",
        productId: "prod_ticket_propaganda",
        quantity: 1,
        snapshotName: "Propaganda Ticket",
        snapshotPrice: 95_000,
        snapshotType: "ticket_regular",
        snapshotVariants: null,
      },
    ],
    tickets: [
      {
        id: "tkt_010",
        qrCode: "qr-propa-010",
        eventDay: "propa3_day2",
        attendanceStatus: "not_checked_in",
        checkedInAt: null,
        checkedInBy: null,
      },
    ],
    refund: {
      id: "ref_003",
      status: "requested",
      reason: "Unexpected family emergency.",
      paymentMethod: "manual",
      paymentProofUrl:
        "https://cdn.tedxuniversitasbrawijaya.com/temp/ref-proof-003.jpg",
      bankAccountNumber: "9876543210",
      bankName: "BNI",
      bankAccountHolder: "Mira Oktaviani",
      processedBy: null,
      processedAt: null,
      rejectionReason: null,
      createdAt: "2026-04-11T08:40:00.000Z",
    },
  },
] as const;

const parsedSeededDetails = seededOrderDetails.map((item, index) => ({
  index,
  parsed: getOrderByIdOutputSchema.safeParse(item),
}));

const getSeededDetailsOrThrow = () => {
  const invalidFixture = parsedSeededDetails.find(
    (entry) => !entry.parsed.success
  );

  if (invalidFixture && !invalidFixture.parsed.success) {
    const firstIssue = invalidFixture.parsed.error.issues[0];

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message: `Invalid seeded order fixture at index ${invalidFixture.index}${firstIssue ? `: ${firstIssue.message}` : ""}`,
    });
  }

  return parsedSeededDetails
    .filter(
      (
        entry
      ): entry is {
        index: number;
        parsed: {
          success: true;
          data: (typeof getOrderByIdOutputSchema)["_output"];
        };
      } => entry.parsed.success
    )
    .map((entry) => entry.parsed.data);
};

type SeededOrderDetail = (typeof getOrderByIdOutputSchema)["_output"];

let mutableSeededDetails: SeededOrderDetail[] | null = null;

const isFixtureFailFastEnabled = () => {
  return (
    process.env.NODE_ENV !== "production" ||
    process.env.ORDER_FIXTURES_FAIL_FAST === "true"
  );
};

const initializeMutableSeededDetails = (): SeededOrderDetail[] => {
  try {
    return getSeededDetailsOrThrow();
  } catch (error) {
    if (isFixtureFailFastEnabled()) {
      throw error;
    }

    throw new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      message:
        "Order fixtures are invalid. Enable fail-fast in non-production to debug fixture issues.",
    });
  }
};

const getMutableSeededDetails = (): SeededOrderDetail[] => {
  if (!mutableSeededDetails) {
    mutableSeededDetails = initializeMutableSeededDetails();
  }

  return mutableSeededDetails;
};

const updateMutableSeededOrder = (
  orderId: string,
  updater: (
    order: (typeof getOrderByIdOutputSchema)["_output"]
  ) => (typeof getOrderByIdOutputSchema)["_output"]
) => {
  const details = getMutableSeededDetails();
  const index = details.findIndex((item) => item.id === orderId);

  if (index < 0) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Order ${orderId} not found.`,
    });
  }
  const existingOrder = details[index];

  if (!existingOrder) {
    throw new TRPCError({
      code: "NOT_FOUND",
      message: `Order ${orderId} not found.`,
    });
  }

  const updatedOrder = updater(existingOrder);

  mutableSeededDetails = details.map((item) =>
    item.id === orderId ? updatedOrder : item
  );

  return updatedOrder;
};

type SeededListOrder = {
  id: string;
  type: string;
  status: string;
  buyerName: string;
  buyerEmail: string;
  createdAt: string;
};

const matchesSearchKeyword = (
  order: SeededListOrder,
  searchKeyword: string | undefined
) => {
  if (!searchKeyword) {
    return true;
  }

  return (
    order.id.toLowerCase().includes(searchKeyword) ||
    order.buyerName.toLowerCase().includes(searchKeyword) ||
    order.buyerEmail.toLowerCase().includes(searchKeyword)
  );
};

const list = protectedProcedure
  .input(listOrdersInputSchema)
  .output(listOrdersOutputSchema)
  .query(async ({ ctx, input }) => {
    const result = await ctx.services.order.listAdminOrders({
      page: input.page,
      limit: input.limit,
      type: input.type,
      status: input.status,
      search: input.search,
      sortBy: input.sortBy,
      sortOrder: input.sortOrder,
    });

    return {
      orders: result.orders.map((order) => ({
        id: order.id,
        type: order.type,
        status: order.status,
        buyerName: order.buyerName,
        buyerEmail: order.buyerEmail,
        totalPrice: order.totalPrice,
        createdAt: order.createdAt,
        paidAt: order.paidAt,
      })),
      pagination: {
        page: input.page,
        limit: input.limit,
        total: result.total,
        totalPages: Math.max(1, Math.ceil(result.total / input.limit)),
      },
    };
  });

const getById = protectedProcedure
  .input(getOrderByIdInputSchema)
  .output(getOrderByIdOutputSchema)
  .query(async ({ ctx, input }) => {
    const result = await ctx.services.order.getAdminOrderById(input.orderId);

    return {
      ...result.order,
      items: result.items,
      tickets: [],
      refund: null,
    };
  });

const verifyPayment = protectedProcedure
  .input(verifyPaymentInputSchema)
  .output(verifyPaymentOutputSchema)
  .mutation(async ({ ctx, input }) => {
    const status = await ctx.services.order.verifyPayment({
      orderId: input.orderId,
      action: input.action,
      reason: input.reason,
      verifierId: ctx.session.user.id,
    });

    return {
      orderId: input.orderId,
      status,
      message:
        status === "paid"
          ? "Payment has been approved"
          : "Payment has been rejected",
    };
  });

const processRefund = protectedProcedure
  .input(processRefundInputSchema)
  .output(processRefundOutputSchema)
  .mutation(({ ctx, input }) => {
    const actor =
      ctx.session.user.name?.trim() ||
      ctx.session.user.email ||
      ctx.session.user.id;

    const updatedOrder = updateMutableSeededOrder(input.orderId, (order) => {
      if (!order.refund) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Order has no refund request.",
        });
      }

      if (order.refund.status !== "requested") {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Refund has already been processed.",
        });
      }

      const now = new Date().toISOString();

      if (input.action === "approve") {
        return {
          ...order,
          status: "refunded",
          updatedAt: now,
          refund: {
            ...order.refund,
            status: "approved",
            processedAt: now,
            processedBy: actor,
            rejectionReason: null,
          },
        };
      }

      const rejectionReason = input.reason?.trim();

      if (!rejectionReason) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Rejection reason is required.",
        });
      }

      return {
        ...order,
        status: "paid",
        updatedAt: now,
        refund: {
          ...order.refund,
          status: "rejected",
          processedAt: now,
          processedBy: actor,
          rejectionReason,
        },
      };
    });

    if (!updatedOrder.refund) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Refund state is unavailable after processing.",
      });
    }

    return {
      orderId: updatedOrder.id,
      refundStatus: updatedOrder.refund.status,
      message:
        input.action === "approve"
          ? "Refund approved successfully."
          : "Refund rejected successfully.",
    };
  });

export const orderRouter = createTRPCRouter({
  list,
  getById,
  verifyPayment,
  processRefund,
});
