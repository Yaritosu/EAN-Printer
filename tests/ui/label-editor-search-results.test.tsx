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
      }
    ])
  );
};

describe("LabelEditor search-first create flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
    seedArticles();
  });

  it("keeps article search as the working focus before and after common create-tab actions", async () => {
    render(<LabelEditor />);

    const searchInput = screen.getByPlaceholderText("Suche nach SKU, Artikelname oder EAN");
    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });

    fireEvent.change(searchInput, { target: { value: "be-pw" } });
    const resultButton = await screen.findByRole("button", { name: /Premium Baumwoll-Shirt/i });
    fireEvent.click(resultButton);

    await waitFor(() => {
      expect(screen.getByDisplayValue("Premium Baumwoll-Shirt")).toBeInTheDocument();
      expect(screen.getByText(/Ausgew/i)).toBeInTheDocument();
      expect(screen.getByRole("button", { name: /Auswahl l/i })).toBeInTheDocument();
      expect(searchInput).toHaveFocus();
    });

    const eanInput = screen.getByLabelText("EAN");
    fireEvent.focus(eanInput);
    fireEvent.change(eanInput, { target: { value: "4260706043787" } });
    fireEvent.blur(eanInput);

    await waitFor(() => {
      expect(searchInput).toHaveFocus();
    });
  });
});
