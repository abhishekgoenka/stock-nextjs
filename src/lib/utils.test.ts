import { cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { convertToExchangeType } from "./utils";

describe("Utility Methods", () => {
  afterEach(() => {
    cleanup();
  });

  it("should convert string to exchange", () => {
    expect(convertToExchangeType("NSE")).toBeTypeOf("string");
    expect(convertToExchangeType("NSE")).toBe("NSE");
    expect(convertToExchangeType("nse")).toBe("NSE");
    expect(convertToExchangeType("NASDAQ")).toBe("NASDAQ");
  });
});
