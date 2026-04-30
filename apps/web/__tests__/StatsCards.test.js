import { render, screen } from "@testing-library/react";
import StatsCards from "../components/StatsCards";

describe("StatsCards", () => {
  it("renders analytics values", () => {
    render(<StatsCards data={{ totalGoals: 8, completedThisWeek: 3, overdueCount: 1 }} />);
    expect(screen.getByText("Total Goals")).toBeInTheDocument();
    expect(screen.getByText("Completed This Week")).toBeInTheDocument();
    expect(screen.getByText("Overdue")).toBeInTheDocument();
    expect(screen.getByText("8")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
  });
});
