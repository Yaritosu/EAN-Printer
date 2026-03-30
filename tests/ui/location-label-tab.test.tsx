import { fireEvent, render, screen } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor location label tab", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("shows a location label flow with code segments and arrow selection", () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Stellplatz-Label" }));

    expect(screen.getByLabelText("Regal")).toBeInTheDocument();
    expect(screen.getByLabelText("Block")).toBeInTheDocument();
    expect(screen.getByLabelText("Ebene")).toBeInTheDocument();
    expect(screen.getByLabelText("Fach")).toBeInTheDocument();
    expect(screen.getByLabelText("Pfeilrichtung")).toBeInTheDocument();
    expect(screen.getByText("Kein Pfeil")).toBeInTheDocument();
    expect(screen.getByText("Pfeil oben")).toBeInTheDocument();
    expect(screen.getByText("Pfeil unten")).toBeInTheDocument();
    expect(screen.getByText(/Stellplatzcode/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Stellplatz-PDF erzeugen" })).toBeInTheDocument();
  });

  it("updates the live preview when a different location layout is selected", () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Stellplatz-Label" }));
    fireEvent.change(screen.getByLabelText("Regal"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Block"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Ebene"), { target: { value: "01" } });
    fireEvent.change(screen.getByLabelText("Fach"), { target: { value: "01" } });

    const layoutSelect = screen.getByLabelText("Layout / Etikettenformat");
    fireEvent.change(layoutSelect, { target: { value: "preset-a6-label" } });

    expect(screen.getByText("148 x 105 mm")).toBeInTheDocument();
  });
});
