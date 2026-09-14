import { test, expect } from "@playwright/test";

test("solicitante envia orçamento pelo painel", async ({ page }) => {
  await page.goto("/");
  await page
    .getByRole("button", {
      name: "Monitor para estação de trabalho",
      exact: true,
    })
    .click();
  const panel = page.getByRole("region", { name: "Aprovação de orçamento" });
  await panel
    .getByRole("button", { name: "Enviar para aprovação", exact: true })
    .click();
  await expect(panel.locator(".approval-status")).toHaveText("Pendente");
  await expect(
    panel.getByRole("button", { name: "Enviar para aprovação", exact: true }),
  ).toHaveCount(0);
});
