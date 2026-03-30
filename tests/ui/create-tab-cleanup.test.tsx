import { render, screen } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor create tab cleanup", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("starts with a cleaned-up create tab and empty manual fields", () => {
    render(<LabelEditor />);

    expect(screen.getByText("Elvent Tools")).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Label Manager" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Etikett drucken" })).toBeInTheDocument();
    expect(screen.getByText(/Druck nicht/i)).toBeInTheDocument();
    expect(screen.getByText(/Artikel aus oder erfasse EAN, Artikelname und SKU\./i)).toBeInTheDocument();

    expect(screen.queryByText(/Lokale Artikeldatenbasis, Layout-Templates/i)).not.toBeInTheDocument();
    expect(screen.queryByText("Label ist fachlich druckbar.")).not.toBeInTheDocument();
    expect(screen.queryByText("Aktives Layout")).not.toBeInTheDocument();
    expect(screen.queryByText(/Treffer erscheinen direkt unter dem Suchfeld/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/\\u00/i)).not.toBeInTheDocument();

    expect(screen.getByLabelText("EAN")).toHaveValue("");
    expect(screen.getByLabelText("Artikelname")).toHaveValue("");
    expect(screen.getByLabelText("SKU (optional)")).toHaveValue("");

    const textboxes = screen.getAllByRole("textbox");
    expect(textboxes[0]).toHaveAttribute("placeholder", "Suche nach SKU, Artikelname oder EAN");
    expect(textboxes[1]).toHaveAttribute("name", "ean");
    expect(textboxes[2]).toHaveAttribute("name", "articleName");
    expect(textboxes[3]).toHaveAttribute("name", "sku");
  });
});
