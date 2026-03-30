import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

const seedArticles = () => {
  window.localStorage.setItem(
    "ean-printer.articles.v1",
    JSON.stringify([
      {
        articleId: "a1",
        name: "Elvent Testjacke",
        sku: "ELV-JACK-7",
        ean: "4260706043787",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      },
      {
        articleId: "a2",
        name: "Winter Fußsack",
        sku: "ELV-WFS-1",
        ean: "4006381333931",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      }
    ])
  );
};

describe("LabelEditor import api flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedArticles();
  });

  it("shows the local article count in the Import/API tab while article search stays in print flow", async () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Import/API" }));

    await waitFor(() => {
      expect(screen.getByText(/Aktuell lokal verfügbare Artikel: 2/i)).toBeInTheDocument();
    });

    expect(screen.queryByText("Artikel suchen und pflegen")).not.toBeInTheDocument();
    expect(screen.queryByPlaceholderText("Suche nach Name, SKU oder EAN")).not.toBeInTheDocument();
  });
});
