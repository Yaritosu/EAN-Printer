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
        name: "Winter Fusssack",
        sku: "ELV-WFS-1",
        ean: "4006381333931",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      }
    ])
  );
};

describe("LabelEditor article search flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedArticles();
  });

  it("finds an existing article in the article tab and loads it into edit mode", async () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Artikel" }));

    const searchInput = screen.getByPlaceholderText("Suche nach Name, SKU oder EAN");
    fireEvent.change(searchInput, { target: { value: "jack" } });

    const resultButton = await screen.findByRole("button", { name: /Elvent Testjacke/i });
    fireEvent.click(resultButton);

    await waitFor(() => {
      expect(screen.getByText("Artikel bearbeiten")).toBeInTheDocument();
      expect(screen.getByLabelText("Artikelname")).toHaveValue("Elvent Testjacke");
      expect(screen.getByLabelText("SKU optional")).toHaveValue("ELV-JACK-7");
      expect(screen.getByLabelText("EAN optional")).toHaveValue("4260706043787");
    });
  });
});
