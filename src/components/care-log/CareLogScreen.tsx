import { useState } from "react";
import type { LogEntry } from "../../types/domain";
import { TYPE_CONFIG } from "../../lib/logTypeConfig";
import { formatDate } from "../../lib/date";
import PageHeader from "../ui/PageHeader";
import Pill from "../ui/Pill";

export default function CareLogScreen({ log }: { log: LogEntry[] }) {
  const [filter, setFilter] = useState("all");
  const filters = ["all", "medication", "symptom", "incident", "appointment"];
  const filtered = filter === "all" ? log : log.filter((e) => e.type === filter);

  const grouped = filtered.reduce<Record<string, LogEntry[]>>((acc, e) => {
    (acc[e.date] = acc[e.date] || []).push(e);
    return acc;
  }, {});

  return (
    <div>
      <PageHeader title="Care Log" subtitle="Shared record of everything that happens" />

      {/* Filter chips */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 20, scrollbarWidth: "none" }}>
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "10px 18px", borderRadius: 20, border: "1.5px solid", whiteSpace: "nowrap",
              fontSize: 14, fontWeight: 500, cursor: "pointer", transition: "all 0.15s", minHeight: 44,
              borderColor: filter === f ? "var(--color-primary)" : "var(--color-border)",
              background: filter === f ? "var(--color-primary)" : "transparent",
              color: filter === f ? "#fff" : "var(--color-muted-foreground)",
              fontFamily: "inherit",
            }}
          >
            {f === "all" ? "All" : (TYPE_CONFIG[f]?.label ?? f)}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        {Object.entries(grouped).map(([date, entries]) => (
          <div key={date}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-muted-foreground)", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 10, paddingBottom: 6, borderBottom: "2px solid var(--color-border)" }}>
              {formatDate(date)}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
              {entries.map((entry, i) => {
                const tc = TYPE_CONFIG[entry.type];
                return (
                  <div key={entry.id} style={{ display: "flex", gap: 12, padding: "12px 0", borderBottom: i < entries.length - 1 ? "1px solid var(--color-border)" : "none" }}>
                    <div className="min-w-28 shrink-0" style={{ paddingTop: 2 }}>
                      <Pill label={tc.label} color={tc.color} bg={tc.bg} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 2 }}>{entry.title}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted-foreground)", marginBottom: 3, lineHeight: 1.4 }}>{entry.detail}</div>
                      <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{entry.time} · {entry.loggedBy}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
