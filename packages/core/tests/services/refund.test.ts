import { describe, test } from "bun:test";

describe("RefundServices", () => {
  describe("getOrderInfo", () => {
    test.todo("should return order info for valid refund token within deadline", () =>
      undefined);
    test.todo("should calculate refund deadline correctly (H-3 before event)", () =>
      undefined);
    test.todo("should derive earliest event date for multi-day ticket bundle", () =>
      undefined);
    test.todo("should fallback to all event dates when event key cannot be inferred from snapshots", () =>
      undefined);
    test.todo("should throw BAD_REQUEST for invalid refund token", () =>
      undefined);
    test.todo("should throw BAD_REQUEST when order is merch and not refundable", () =>
      undefined);
    test.todo("should throw BAD_REQUEST when order status is not paid", () =>
      undefined);
    test.todo("should throw BAD_REQUEST when refund is already requested", () =>
      undefined);
    test.todo("should throw BAD_REQUEST when refund deadline has passed", () =>
      undefined);
    test.todo("should throw INTERNAL_SERVER_ERROR when refund configuration is missing", () =>
      undefined);
  });

  describe("submitRequest", () => {
    test.todo("should submit refund request with manual payment proof", () =>
      undefined);
    test.todo("should handle saga rollback if refund request creation fails", () =>
      undefined);
    test.todo("should throw BAD_REQUEST on payment method mismatch", () =>
      undefined);
    test.todo("should throw BAD_REQUEST when manual payment proof is missing", () =>
      undefined);
    test.todo("should restore previous order status when refund creation fails", () =>
      undefined);
    test.todo("should throw REFUND_REQUEST_STATE_ROLLBACK_FAILED when rollback update fails", () =>
      undefined);
  });

  describe("getRefundByOrderId", () => {
    test.todo("should return refund request for order", () => undefined);
    test.todo("should return null if no refund request exists", () =>
      undefined);
  });
});
