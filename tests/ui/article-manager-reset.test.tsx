import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor article maintenance flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("clears the manual article form after save and makes the article available in create search", async () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Artikel" }));

    const nameInput = screen.getByLabelText("Artikelname");
    const skuInput = screen.getByLabelText("SKU (optional)");
    const eanInput = screen.getByLabelText("EAN (optional)");

    fireEvent.change(nameInput, { target: { value: "Testjacke" } });
    fireEvent.change(skuInput, { target: { value: "ELV-JACK-7" } });
    fireEvent.change(eanInput, { target: { value: "4260706043787" } });

    fireEvent.click(screen.getByRole("button", { name: "Artikel speichern" }));

    await waitFor(() => {
      expect(screen.getByText(/Formular ist bereit für den nächsten Artikel/i)).toBeInTheDocument();
    });

    expect(screen.getByLabelText("Artikelname")).toHaveValue("");
    expect(screen.getByLabelText("SKU (optional)")).toHaveValue("");
    expect(screen.getByLabelText("EAN (optional)")).toHaveValue("");

    fireEvent.click(screen.getByRole("button", { name: "Etikett erstellen" }));

    const searchInput = screen.getByPlaceholderText("Suche nach SKU, Artikelname oder EAN");
    fireEvent.change(searchInput, { target: { value: "jack" } });

    expect(await screen.findByRole("button", { name: /Testjacke/i })).toBeInTheDocument();
  });
});
