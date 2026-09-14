import { test, expect } from "@playwright/test";

test("criar, editar, filtrar e concluir uma demanda pelo navegador", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Nova demanda", exact: true }).click();
  await page
    .getByLabel("Título da demanda", { exact: true })
    .fill("Compra do workshop");
  await page
    .getByLabel("Descrição", { exact: true })
    .fill("Solicitação usada na verificação pelo navegador.");
  await page
    .getByLabel("Valor solicitado (R$)", { exact: true })
    .fill("1200,05");
  await page
    .getByRole("button", { name: "Criar demanda", exact: true })
    .click();
  const details = page.getByRole("dialog", { name: "Detalhes da demanda" });
  await expect(
    details.getByRole("heading", { name: "Compra do workshop" }),
  ).toBeVisible();
  await expect(details.locator(".budget strong")).toContainText("1.200,05");
  await details.getByRole("button", { name: "Editar demanda" }).click();
  await page
    .getByLabel("Valor solicitado (R$)", { exact: true })
    .fill("1500,00");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(details.locator(".budget strong")).toContainText("1.500,00");
  await expect(
    details.getByRole("button", { name: "Iniciar demanda" }),
  ).toBeDisabled();
  await details
    .getByRole("button", { name: "Enviar para aprovação", exact: true })
    .click();
  await details.getByRole("button", { name: "Fechar janela" }).click();
  await page.getByLabel("Perfil de demonstração").selectOption("bruno");
  await page
    .getByRole("button", { name: "Compra do workshop", exact: true })
    .click();
  await details.getByRole("button", { name: "Aprovar orçamento" }).click();
  await expect(details.locator(".approval-status")).toHaveText("Aprovada");
  await details.getByRole("button", { name: "Fechar janela" }).click();
  await page.getByLabel("Perfil de demonstração").selectOption("ana");
  await page
    .getByRole("button", { name: "Compra do workshop", exact: true })
    .click();
  await details.getByRole("button", { name: "Iniciar demanda" }).click();
  await expect(details.locator(".badge")).toHaveText("Em andamento");
  await details.getByRole("button", { name: "Concluir demanda" }).click();
  await expect(details.locator(".badge")).toHaveText("Concluída");
  await details.getByRole("button", { name: "Fechar janela" }).click();
  await page.reload();
  await page
    .getByRole("textbox", { name: "Buscar demandas" })
    .fill("Compra do workshop");
  await expect(page.locator(".demand-card")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Compra do workshop", exact: true })
    .click();
  await expect(
    page.getByRole("dialog").getByText("Concluiu a demanda.", { exact: true }),
  ).toBeVisible();
});

test("a tela funciona em largura pequena e oferece estado vazio", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Buscar demandas" })
    .fill("demanda inexistente xyz");
  await expect(page.locator(".column-empty")).toHaveCount(3);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Usar tema escuro" }).click();
  await expect(page.locator(".portal")).toHaveAttribute("data-theme", "dark");
});
