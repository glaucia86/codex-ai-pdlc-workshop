"use client";
import { useState } from "react";
import { Check } from "lucide-react";
import {
  areas,
  priorities,
  type Demand,
  type DemandInput,
} from "../domain/model";
import { parseAmount } from "../domain/currency";

export function DemandForm({
  demand,
  busy,
  error,
  onSave,
  onCancel,
}: {
  demand?: Demand;
  busy: boolean;
  error: string;
  onSave: (input: DemandInput) => void;
  onCancel: () => void;
}) {
  const [inputError, setInputError] = useState("");
  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setInputError("");
    const fields = new FormData(event.currentTarget);
    try {
      const input: DemandInput = {
        title: String(fields.get("title")),
        description: String(fields.get("description")),
        area: String(fields.get("area")) as DemandInput["area"],
        priority: String(fields.get("priority")) as DemandInput["priority"],
        amountCents: parseAmount(String(fields.get("amount"))),
      };
      onSave(input);
    } catch (caught) {
      setInputError(
        caught instanceof Error ? caught.message : "Confira o valor informado.",
      );
    }
  }
  return (
    <form onSubmit={submit} className="demand-form">
      <span className="eyebrow">DEMANDAS DA EQUIPE</span>
      <h2>{demand ? "Editar demanda" : "Nova demanda"}</h2>
      <fieldset disabled={busy}>
        <label>
          Título da demanda
          <input
            name="title"
            required
            minLength={3}
            maxLength={120}
            defaultValue={demand?.title || ""}
            placeholder="Ex.: Monitor para estação de trabalho"
          />
        </label>
        <label>
          Descrição
          <textarea
            name="description"
            rows={3}
            maxLength={2000}
            defaultValue={demand?.description || ""}
            placeholder="Conte o que a equipe precisa."
          />
        </label>
        <div className="form-columns">
          <label>
            Valor solicitado (R$)
            <input
              name="amount"
              aria-label="Valor solicitado (R$)"
              aria-describedby="amount-help"
              readOnly={Boolean(demand && demand.status !== "Nova")}
              inputMode="decimal"
              required
              defaultValue={
                demand
                  ? (demand.amountCents / 100).toFixed(2).replace(".", ",")
                  : ""
              }
              placeholder="1200,00"
            />
            <small id="amount-help">
              {demand && demand.status !== "Nova"
                ? "Valor bloqueado após o início da execução."
                : "Sem separador de milhares."}
            </small>
          </label>
          <label>
            Área
            <select name="area" defaultValue={demand?.area || "Engenharia"}>
              {areas.map((area) => (
                <option key={area}>{area}</option>
              ))}
            </select>
          </label>
        </div>
        <label>
          Prioridade
          <select name="priority" defaultValue={demand?.priority || "Média"}>
            {priorities.map((priority) => (
              <option key={priority}>{priority}</option>
            ))}
          </select>
        </label>
      </fieldset>
      {(inputError || error) && (
        <p className="error" role="alert">
          {inputError || error}
        </p>
      )}
      <div className="form-actions">
        <button
          className="secondary"
          type="button"
          disabled={busy}
          onClick={onCancel}
        >
          Cancelar
        </button>
        <button className="primary" type="submit" disabled={busy}>
          <Check size={16} />
          {busy ? "Salvando…" : demand ? "Salvar alterações" : "Criar demanda"}
        </button>
      </div>
    </form>
  );
}
