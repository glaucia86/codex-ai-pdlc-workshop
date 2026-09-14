"use client";
import { useEffect, useState } from "react";
import {
  Building2,
  Circle,
  CircleCheck,
  CircleDot,
  LayoutDashboard,
  ListFilter,
  Moon,
  Plus,
  RefreshCw,
  Search,
  Sun,
  X,
} from "lucide-react";
import {
  areas,
  priorities,
  statuses,
  type Command,
  type Database,
  type Demand,
  type DemandInput,
} from "../domain/model";
import { formatAmount } from "../domain/currency";
import { Avatar, Priority } from "./shared";
import { Modal } from "./modal";
import { DemandDetail } from "./demand-detail";
import { DemandForm } from "./demand-form";
import Link from "next/link";

async function loadDatabase(): Promise<Database> {
  const response = await fetch("/api/demands", { cache: "no-store" });
  const data = await response.json();
  if (!response.ok)
    throw new Error(data.error || "Não foi possível carregar as demandas.");
  return data;
}

export function Portal() {
  const [db, setDb] = useState<Database | null>(null);
  const [actorId, setActorId] = useState("ana");
  const [dark, setDark] = useState(false);
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("");
  const [priority, setPriority] = useState("");
  const [mine, setMine] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [editing, setEditing] = useState<Demand | "new" | null>(null);
  const [busy, setBusy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function refresh() {
    setDb(await loadDatabase());
  }
  useEffect(() => {
    let active = true;
    loadDatabase()
      .then((data) => {
        if (active) setDb(data);
      })
      .catch((caught) => {
        if (active) setError(caught.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!notice) return;
    const timer = setTimeout(() => setNotice(""), 4000);
    return () => clearTimeout(timer);
  }, [notice]);

  async function mutate(command: Command) {
    if (busy) return;
    setBusy(true);
    setError("");
    try {
      const response = await fetch("/api/demands", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-demo-user": actorId },
        body: JSON.stringify(command),
      });
      const data = await response.json();
      if (!response.ok) {
        await refresh();
        throw new Error(data.error);
      }
      await refresh();
      setEditing(null);
      setSelected(data.demand.id);
      setNotice("Demanda atualizada.");
      if (command.type === "create") {
        setQuery("");
        setArea("");
        setPriority("");
      }
    } catch (caught) {
      setError(
        caught instanceof Error ? caught.message : "Não foi possível salvar.",
      );
    } finally {
      setBusy(false);
    }
  }
  function save(input: DemandInput) {
    if (editing === "new") void mutate({ type: "create", input });
    else if (editing)
      void mutate({
        type: "update",
        id: editing.id,
        version: editing.version,
        input,
      });
  }
  const actor = db?.users.find((user) => user.id === actorId);
  const current = db?.demands.find((demand) => demand.id === selected);
  const normalize = (text: string) =>
    text
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const filtered = (db?.demands || []).filter(
    (demand) =>
      (!query ||
        normalize(demand.title + demand.id + demand.description).includes(
          normalize(query),
        )) &&
      (!area || demand.area === area) &&
      (!priority || demand.priority === priority) &&
      (!mine || demand.requesterId === actorId),
  );
  const active = (db?.demands || []).filter(
    (demand) => demand.status !== "Concluída",
  );

  return (
    <div className="portal" data-theme={dark ? "dark" : "light"}>
      <header className="topnav">
        <Link className="brand" href="/" aria-label="Nexo, início">
          <span className="brand-symbol">
            <LayoutDashboard size={22} />
          </span>
          nexo<span className="brand-dot">.</span>
        </Link>
        <div className="navigation">
          <span>Workspace</span>
          <strong>Demandas</strong>
        </div>
        <div className="topbar-actions">
          <button
            className="icon-button theme-toggle"
            aria-label={dark ? "Usar tema claro" : "Usar tema escuro"}
            onClick={() => setDark(!dark)}
          >
            {dark ? <Sun size={19} /> : <Moon size={19} />}
          </button>
          {actor && (
            <div className="profile">
              <Avatar name={actor.name} />
              <label>
                <span>Acesso de demonstração</span>
                <select
                  aria-label="Perfil de demonstração"
                  disabled={busy}
                  value={actorId}
                  onChange={(event) => {
                    setActorId(event.target.value);
                    setSelected(null);
                    setEditing(null);
                    setError("");
                  }}
                >
                  {db!.users.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ·{" "}
                      {user.role === "gestor" ? "Gestor" : "Solicitante"}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          )}
        </div>
      </header>
      <main>
        <div className="intro">
          <div>
            <span className="eyebrow">UMA EQUIPE. UMA VISÃO.</span>
            <h1>
              O trabalho em movimento<span>.</span>
            </h1>
            <p>Acompanhe as demandas da equipe, de ponta a ponta.</p>
          </div>
          <button
            className="primary"
            disabled={!db || busy}
            onClick={() => {
              setEditing("new");
              setError("");
            }}
          >
            <Plus size={18} />
            Nova demanda
          </button>
        </div>
        {db && (
          <div className="summary">
            <div>
              <span>Demandas abertas</span>
              <strong>
                {active.length}
                <small>em acompanhamento</small>
              </strong>
            </div>
            <div>
              <span>Valor solicitado em aberto</span>
              <strong>
                {formatAmount(
                  active.reduce(
                    (total, demand) => total + demand.amountCents,
                    0,
                  ),
                )}
              </strong>
            </div>
            <div>
              <span>Demandas concluídas</span>
              <strong>
                {db.demands.length - active.length}
                <small>entregas realizadas</small>
              </strong>
            </div>
          </div>
        )}
        <div className="filters">
          <label className="search">
            <Search size={18} aria-hidden="true" />
            <input
              aria-label="Buscar demandas"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Buscar demanda…"
            />
            {query && (
              <button
                className="icon-button"
                aria-label="Limpar busca"
                onClick={() => setQuery("")}
              >
                <X size={15} />
              </button>
            )}
          </label>
          <label className="mine">
            <input
              type="checkbox"
              checked={mine}
              onChange={(event) => setMine(event.target.checked)}
            />
            Só minhas
          </label>
          <div className="filter-select">
            <Building2 size={16} aria-hidden="true" />
            <select
              aria-label="Filtrar por área"
              value={area}
              onChange={(event) => setArea(event.target.value)}
            >
              <option value="">Todas as áreas</option>
              {areas.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <div className="filter-select">
            <ListFilter size={16} aria-hidden="true" />
            <select
              aria-label="Filtrar por prioridade"
              value={priority}
              onChange={(event) => setPriority(event.target.value)}
            >
              <option value="">Prioridade</option>
              {priorities.map((value) => (
                <option key={value}>{value}</option>
              ))}
            </select>
          </div>
          <button
            className="icon-button refresh"
            aria-label="Atualizar demandas"
            disabled={busy}
            onClick={() => {
              setError("");
              void refresh().catch((caught) => setError(caught.message));
            }}
          >
            <RefreshCw size={17} />
          </button>
        </div>
        {error && !selected && !editing && (
          <p className="error" role="alert">
            {error}
          </p>
        )}
        {loading ? (
          <div className="loading" role="status">
            Carregando as demandas…
          </div>
        ) : (
          <div className="board">
            {statuses.map((status) => {
              const cards = filtered.filter(
                (demand) => demand.status === status,
              );
              const Icon =
                status === "Nova"
                  ? Circle
                  : status === "Em andamento"
                    ? CircleDot
                    : CircleCheck;
              return (
                <section
                  className={`column ${status === "Nova" ? "new" : status === "Em andamento" ? "active" : "done"}`}
                  key={status}
                  aria-label={status}
                >
                  <h2 className="column-heading">
                    <Icon size={16} aria-hidden="true" />
                    {status === "Nova"
                      ? "Novas"
                      : status === "Concluída"
                        ? "Concluídas"
                        : status}
                    <span>{cards.length}</span>
                  </h2>
                  <div className="column-body">
                    {cards.map((demand) => {
                      const requester = db!.users.find(
                        (user) => user.id === demand.requesterId,
                      )!;
                      return (
                        <article className="demand-card" key={demand.id}>
                          <div className="card-meta">
                            <span>{demand.id}</span>
                            <Priority value={demand.priority} />
                          </div>
                          <button
                            className="card-title"
                            onClick={() => {
                              setSelected(demand.id);
                              setError("");
                            }}
                          >
                            {demand.title}
                          </button>
                          <p className="card-description">
                            {demand.description || "Sem descrição."}
                          </p>
                          <span className="card-area">
                            <Building2 size={13} aria-hidden="true" />
                            {demand.area}
                          </span>
                          {demand.status === "Nova" && (
                            <span
                              className="approval-status"
                              data-status={demand.approval.status}
                            >
                              {demand.approval.status}
                            </span>
                          )}
                          <div className="card-bottom">
                            <strong>{formatAmount(demand.amountCents)}</strong>
                            <span title={`Solicitante: ${requester.name}`}>
                              <Avatar name={requester.name} />
                              <span className="sr-only">
                                Solicitante: {requester.name}
                              </span>
                            </span>
                          </div>
                        </article>
                      );
                    })}
                    {!cards.length && (
                      <p className="column-empty">
                        Nenhuma demanda nesta etapa
                        {query || area || priority || mine
                          ? " com os filtros atuais"
                          : ""}
                        .
                      </p>
                    )}
                  </div>
                </section>
              );
            })}
          </div>
        )}
        <footer>
          <span>
            <span className="demo-dot" />
            Ambiente de demonstração · dados fictícios
          </span>
          <span>Codex Community · Rio de Janeiro</span>
        </footer>
      </main>
      {current && actor && !editing && (
        <Modal
          label="Detalhes da demanda"
          busy={busy}
          onClose={() => {
            setSelected(null);
            setError("");
          }}
        >
          <DemandDetail
            demand={current}
            actor={actor}
            users={db!.users}
            busy={busy}
            error={error}
            onEdit={() => {
              setEditing(current);
              setError("");
            }}
            onCommand={(command) => void mutate(command)}
            onAdvance={() =>
              void mutate({
                type: "advance",
                id: current.id,
                version: current.version,
              })
            }
          />
        </Modal>
      )}
      {editing && (
        <Modal
          label={editing === "new" ? "Nova demanda" : "Editar demanda"}
          busy={busy}
          onClose={() => {
            setEditing(null);
            setError("");
          }}
        >
          <DemandForm
            key={editing === "new" ? "new" : editing.id}
            demand={editing === "new" ? undefined : editing}
            busy={busy}
            error={error}
            onSave={save}
            onCancel={() => {
              setEditing(null);
              setError("");
            }}
          />
        </Modal>
      )}
      <div className={`toast ${notice ? "visible" : ""}`} role="status">
        {notice && (
          <>
            <CircleCheck size={18} />
            {notice}
          </>
        )}
      </div>
    </div>
  );
}
