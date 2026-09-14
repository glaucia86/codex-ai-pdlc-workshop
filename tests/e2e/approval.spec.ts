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

test("aprovação, alteração de valor, rejeição, reenvio e bloqueio após início", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Nova demanda", exact: true }).click();
  await page
    .getByLabel("Título da demanda", { exact: true })
    .fill("Orçamento com reavaliação");
  await page
    .getByLabel("Valor solicitado (R$)", { exact: true })
    .fill("1200,00");
  await page
    .getByRole("button", { name: "Criar demanda", exact: true })
    .click();
  const details = page.getByRole("dialog", { name: "Detalhes da demanda" });
  const state = details.locator(".approval-status");
  async function profile(actor: string) {
    await details.getByRole("button", { name: "Fechar janela" }).click();
    await page.getByLabel("Perfil de demonstração").selectOption(actor);
    await page
      .getByRole("button", { name: "Orçamento com reavaliação", exact: true })
      .click();
  }
  await details
    .getByRole("button", { name: "Enviar para aprovação", exact: true })
    .click();
  await expect(state).toHaveText("Pendente");
  await profile("bruno");
  await details.getByRole("button", { name: "Aprovar orçamento" }).click();
  await expect(state).toHaveText("Aprovada");
  await profile("ana");
  await details.getByRole("button", { name: "Editar demanda" }).click();
  await page
    .getByLabel("Valor solicitado (R$)", { exact: true })
    .fill("1500,00");
  await page.getByRole("button", { name: "Salvar alterações" }).click();
  await expect(state).toHaveText("Não solicitada");
  await expect(
    details.getByRole("button", { name: "Iniciar demanda" }),
  ).toBeDisabled();
  await expect(
    details.getByText("Aprovou R$ 1.200,00.", { exact: true }),
  ).toBeVisible();
  await details
    .getByRole("button", { name: "Enviar para aprovação", exact: true })
    .click();
  await expect(state).toHaveText("Pendente");
  await profile("bruno");
  await expect(
    details.getByRole("button", { name: "Rejeitar orçamento" }),
  ).toBeDisabled();
  await details.getByLabel("Justificativa da rejeição").fill("Revisar cotação");
  await details.getByRole("button", { name: "Rejeitar orçamento" }).click();
  await expect(state).toHaveText("Rejeitada");
  await profile("ana");
  await details
    .getByRole("button", { name: "Reenviar para aprovação" })
    .click();
  await expect(state).toHaveText("Pendente");
  await profile("marina");
  await details.getByRole("button", { name: "Aprovar orçamento" }).click();
  await expect(state).toHaveText("Aprovada");
  await profile("ana");
  await details.getByRole("button", { name: "Iniciar demanda" }).click();
  await expect(details.locator(".badge")).toHaveText("Em andamento");
  await details.getByRole("button", { name: "Editar demanda" }).click();
  await expect(
    page.getByLabel("Valor solicitado (R$)", { exact: true }),
  ).toHaveAttribute("readonly", "");
  await page.getByRole("button", { name: "Cancelar", exact: true }).click();
  await details.getByRole("button", { name: "Concluir demanda" }).click();
  await expect(details.locator(".badge")).toHaveText("Concluída");
  await page.reload();
  await page
    .getByRole("button", { name: "Orçamento com reavaliação", exact: true })
    .click();
  await expect(details.locator(".budget strong")).toContainText("1.500,00");
  await expect(details.getByText(/Rejeitou.*Revisar cotação/)).toBeVisible();
  await expect(
    details.getByRole("button", { name: "Editar demanda" }),
  ).toHaveCount(0);
});
