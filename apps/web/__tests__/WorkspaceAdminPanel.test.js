import { fireEvent, render, screen } from "@testing-library/react";
import WorkspaceAdminPanel from "../components/WorkspaceAdminPanel";

describe("WorkspaceAdminPanel", () => {
  it("submits invite with role", async () => {
    const onInviteMember = jest.fn().mockResolvedValue({ ok: true, message: "Invited" });
    render(<WorkspaceAdminPanel onCreateWorkspace={jest.fn()} onInviteMember={onInviteMember} />);

    fireEvent.change(screen.getByPlaceholderText("Invite by email"), { target: { value: "teammate@example.com" } });
    fireEvent.change(screen.getByDisplayValue("Member"), { target: { value: "ADMIN" } });
    fireEvent.click(screen.getByText("Invite"));

    expect(onInviteMember).toHaveBeenCalledWith("teammate@example.com", "ADMIN");
  });
});
