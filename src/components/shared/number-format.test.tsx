import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { describe, it, expect, afterEach } from "vitest";
import NumberFormater from "./number-format";

describe("NumberFormater", () => {
  afterEach(() => {
    cleanup();
  });

  it("should inr number format", () => {
    render(<NumberFormater value={123} />);
    expect(screen.getByText("₹123.00")).toBeDefined();
  });

  it("should usd number format when exchange is NASDAQ", () => {
    render(<NumberFormater value={123} exchange="NASDAQ" />);
    expect(screen.getByText("$123.00")).toBeDefined();
  });

  it("should inr number format when exchange is NSE", () => {
    render(<NumberFormater value={123} exchange="NSE" />);
    expect(screen.getByText("₹123.00")).toBeDefined();
  });

  it("should usd number format when currency is USD", () => {
    render(<NumberFormater value={123} currency="USD" />);
    expect(screen.getByText("$123.00")).toBeDefined();
  });

  it("should usd number format when currency is INR", () => {
    render(<NumberFormater value={123} currency="INR" />);
    expect(screen.getByText("₹123.00")).toBeDefined();
  });
});
