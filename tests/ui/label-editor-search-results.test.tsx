import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

const seedArticles = () => {
  window.localStorage.setItem(
    "ean-printer.articles.v1",
    JSON.stringify([
      {
        articleId: "a1",
        name: "Premium Baumwoll-Shirt",
        sku: "BE-PW-0",
        ean: "4260706043787",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      },
      {
        articleId: "a2",
        name: "Winter Hoodie",
        sku: "ELV-HOOD-1",
        ean: "4006381333931",
        status: "active",
        createdAt: "2026-03-28T00:00:00.000Z",
        updatedAt: "2026-03-28T00:00:00.000Z"
      }
    ])
  );
};

describe("LabelEditor search-first create flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedArticles();
  });

  it("closes the autocomplete result list after selecting an article", async () => {
    render(<LabelEditor />);

    const searchInput = screen.getByPlaceholderText("Suche nach SKU, Artikelname oder EAN");
    fireEvent.change(searchInput, { target: { value: "be-pw" } });

    const resultButton = await screen.findByRole("button", { name: /Premium Baumwoll-Shirt/i });
    fireEvent.click(resultButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Premium Baumwoll-Shirt")).toBeInTheDocument();
      expect(screen.getByDisplayValue("BE-PW-0")).toBeInTheDocument();
      expect(screen.getByDisplayValue("4260706043787")).toBeInTheDocument();
    });

    expect(screen.queryByRole("button", { name: /Premium Baumwoll-Shirt/i })).not.toBeInTheDocument();
  });
});
