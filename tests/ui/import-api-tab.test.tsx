import { fireEvent, render, screen } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor Import/API tab", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the prepared Shopify area and keeps csv import without article maintenance", () => {
    render(<LabelEditor />);

    expect(screen.getByRole("button", { name: "Import/API" })).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Import/API" }));

    expect(screen.getByText("Shopify-Verbindung")).toBeInTheDocument();
    expect(screen.getByLabelText("Shop-Domain")).toBeInTheDocument();
    expect(screen.getByLabelText("Admin API Token")).toBeInTheDocument();
    expect(screen.getByLabelText("API-Version")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Verbindung speichern" })).toBeInTheDocument();
    expect(screen.getByText(/Verbindung vorbereitet/i)).toBeInTheDocument();

    expect(screen.getByText("Import CSV / Excel")).toBeInTheDocument();
    expect(screen.getByText("Datei auswählen")).toBeInTheDocument();

    expect(screen.queryByText("Artikel suchen und pflegen")).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Neuer Artikel" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Artikel speichern" })).not.toBeInTheDocument();
  });
});
