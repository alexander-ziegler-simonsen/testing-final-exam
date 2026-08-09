import { expect, test } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter } from "react-router";
import SidebarElement from "./SidebarElement";
import { Provider } from "./ui/provider";

// SidebarElement renders a react-router <Link> (needs a Router) and Chakra
// components (needs ChakraProvider), same wrapper pattern as Sidebar.test.tsx,
// which is the component that actually mounts SidebarElement in the app.
function renderSidebarElement(props: React.ComponentProps<typeof SidebarElement>) {
  return render(<SidebarElement {...props} />, {
    wrapper: ({ children }) => (
      <Provider>
        <MemoryRouter>{children}</MemoryRouter>
      </Provider>
    ),
  });
}

test("renders the title and icon under the given testId", async () => {
  const { getByTestId } = await renderSidebarElement({
    selected: false,
    title: "shifts",
    icon: <span data-testid="shifts-icon">icon</span>,
    path: "shifts",
    testId: "sidebar-desktop-shifts-link",
  });

  await expect.element(getByTestId("sidebar-desktop-shifts-link")).toHaveTextContent("shifts");
  await expect.element(getByTestId("shifts-icon")).toBeInTheDocument();
});

test("renders the open button as a link to the given path", async () => {
  const { getByRole } = await renderSidebarElement({
    selected: false,
    title: "shifts",
    icon: <span>icon</span>,
    path: "shifts",
    testId: "sidebar-desktop-shifts-link",
  });

  // The data-testid sits on the <Button> nested inside the react-router
  // <Link>, so the href actually lives on the surrounding <a> - querying by
  // its "link" role reaches that anchor directly.
  await expect.element(getByRole("link", { name: "open" })).toHaveAttribute("href", "/shifts");
});

test("keeps testIds distinct per caller so the same element can render twice", async () => {
  // Sidebar.tsx renders this same list once for the desktop panel and once for
  // the mobile drawer, both mounted at once - this is why the caller supplies
  // a distinct testId prefix instead of the component deriving one from title/path.
  const { getByTestId } = await renderSidebarElement({
    selected: false,
    title: "shifts",
    icon: <span>icon</span>,
    path: "shifts",
    testId: "sidebar-mobile-shifts-link",
  });

  await expect.element(getByTestId("sidebar-mobile-shifts-link")).toBeInTheDocument();
  await expect.element(getByTestId("sidebar-desktop-shifts-link")).not.toBeInTheDocument();
});
