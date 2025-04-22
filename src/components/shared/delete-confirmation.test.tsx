import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";

import { DeleteConfirmation } from "./delete-confirmation";

describe("DeleteConfirmation", () => {
  afterEach(() => {
    cleanup();
  });

  it("should show delete confirmation", () => {
    const mockOnCancel = vi.fn();
    const mockOnContinue = vi.fn();
    render(<DeleteConfirmation open={true} onCancel={mockOnCancel} onContinue={mockOnContinue} />);
    expect(screen.getByRole("heading").textContent).toBe("Are you absolutely sure?");
  });

  it("should close dialog on Cancel", async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn();
    const mockOnContinue = vi.fn();

    render(<DeleteConfirmation open={true} onCancel={mockOnCancel} onContinue={mockOnContinue} />);
    await user.click(screen.getByRole("button", { name: /Cancel/i }));
    expect(mockOnCancel).toBeCalledTimes(1);
    expect(mockOnContinue).toBeCalledTimes(0);
  });

  it("should close dialog on Continue", async () => {
    const user = userEvent.setup();
    const mockOnCancel = vi.fn();
    const mockOnContinue = vi.fn();

    render(<DeleteConfirmation open={true} onCancel={mockOnCancel} onContinue={mockOnContinue} />);
    await user.click(screen.getByRole("button", { name: /Continue/i }));
    expect(mockOnCancel).toBeCalledTimes(0);
    expect(mockOnContinue).toBeCalledTimes(1);
  });
});
