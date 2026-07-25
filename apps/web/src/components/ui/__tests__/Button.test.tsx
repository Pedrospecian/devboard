import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Button } from "@/components/ui/Button";

describe("Button", () => {
  it("renders the text passed as children", () => {
    render(<Button>Save</Button>);
    expect(screen.getByRole("button", { name: "Save" })).toBeInTheDocument();
  });

  it("calls onClick when clicked", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(<Button onClick={handleClick}>Confirm</Button>);
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("does not call onClick when the button is disabled", async () => {
    const user = userEvent.setup();
    const handleClick = vi.fn();

    render(
      <Button onClick={handleClick} disabled>
        Sending...
      </Button>
    );
    await user.click(screen.getByRole("button", { name: "Sending..." }));

    expect(handleClick).not.toHaveBeenCalled();
  });

  it("applies the disabled attribute on the button element", () => {
    render(<Button disabled>Unavailable</Button>);
    expect(screen.getByRole("button", { name: "Unavailable" })).toBeDisabled();
  });
});
