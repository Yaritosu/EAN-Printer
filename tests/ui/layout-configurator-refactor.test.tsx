import { fireEvent, render, screen } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor layout configurator refactor", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows the simplified layout configurator", () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Layout konfigurieren" }));

    expect(screen.getByLabelText("Layout auswählen")).toBeInTheDocument();
    expect(screen.getByLabelText("Template-Name")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Layout speichern" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Auf Standard/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /In Layout laden/i })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: /Bestehendes aktualisieren/i })).not.toBeInTheDocument();
    expect(screen.queryByText(/Templates speichern nur Layout und Anzeige/i)).not.toBeInTheDocument();

    expect(screen.getByLabelText("Breite mm")).toBeInTheDocument();
    expect(screen.getByLabelText("Höhe mm")).toBeInTheDocument();
    expect(screen.getByLabelText("Rand mm")).toBeInTheDocument();
    expect(screen.getByLabelText("Textgröße")).toBeInTheDocument();
    expect(screen.getByLabelText("SKU-Größe")).toBeInTheDocument();
    expect(screen.getByLabelText("Barcode-Größe")).toBeInTheDocument();
    expect(screen.getByLabelText("Layout-Ausrichtung")).toBeInTheDocument();

    expect(screen.queryByLabelText("Rand oben mm")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Barcode-Skalierung")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("Ausrichtung")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("SKU anzeigen")).not.toBeInTheDocument();
    expect(screen.queryByLabelText("EAN-Klarschrift anzeigen")).not.toBeInTheDocument();

    const orientation = screen.getByLabelText("Layout-Ausrichtung");
    expect(orientation).toHaveTextContent("Querformat");
    expect(orientation).toHaveTextContent("Hochformat");
  });
});
