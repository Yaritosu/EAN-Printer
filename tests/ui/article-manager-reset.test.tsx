import { fireEvent, render, screen, waitFor } from "@testing-library/react";

import { LabelEditor } from "@/ui/components/label-editor";

describe("LabelEditor shopify preparation flow", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("stores a shopify configuration locally and shows it as prepared", async () => {
    render(<LabelEditor />);

    fireEvent.click(screen.getByRole("button", { name: "Import/API" }));

    fireEvent.change(screen.getByLabelText("Shop-Domain"), { target: { value: "elvent-3.myshopify.com" } });
    fireEvent.change(screen.getByLabelText("Admin API Token"), { target: { value: "shpat_test_token" } });
    fireEvent.change(screen.getByLabelText("API-Version"), { target: { value: "2026-01" } });

    fireEvent.click(screen.getByRole("button", { name: "Verbindung speichern" }));

    await waitFor(() => {
      expect(screen.getByText(/Shopify-Konfiguration für elvent-3\.myshopify\.com wurde gespeichert\./i)).toBeInTheDocument();
      expect(screen.getByText(/Konfiguration gespeichert für elvent-3\.myshopify\.com/i)).toBeInTheDocument();
    });
  });
});
