import { useState } from "react";
import { caregivers } from "../../data/seed";
import PageHeader from "../ui/PageHeader";
import Card from "../ui/Card";
import Avatar from "../ui/Avatar";
import Pill from "../ui/Pill";

export default function CaregiversScreen() {
  const [selected, setSelected] = useState<string | null>(null);
  const sel = caregivers.find((c) => c.id === selected);

  return (
    <div>
      <PageHeader title="Care Team" subtitle="Family, aides, and physicians" />
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {caregivers.map((c) => (
          <Card
            key={c.id}
            onClick={() => setSelected(selected === c.id ? null : c.id)}
            style={{ borderColor: selected === c.id ? "var(--color-primary)" : undefined, border: selected === c.id ? "1.5px solid var(--color-primary)" : undefined }}
          >
            <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
              <Avatar initials={c.initials} color={c.color} size={44} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{c.name}</div>
                <div style={{ fontSize: 13, color: "var(--color-muted-foreground)" }}>{c.role}</div>
                <div style={{ fontSize: 12, color: "var(--color-muted-foreground)", marginTop: 2 }}>{c.schedule}</div>
              </div>
              <Pill label={c.relationship} color="var(--color-muted-foreground)" bg="var(--color-muted)" />
            </div>

            {selected === c.id && sel && sel.id === c.id && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid var(--color-border)", display: "flex", flexDirection: "column", gap: 10 }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0 }}>Phone</div>
                  <a href={`tel:${c.phone.replace(/\D/g, "")}`} style={{ fontSize: 15, color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>{c.phone}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0 }}>Email</div>
                  <a href={`mailto:${c.email}`} style={{ fontSize: 15, color: "var(--color-primary)", fontWeight: 500, textDecoration: "none" }}>{c.email}</a>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "var(--color-muted-foreground)", width: 64, flexShrink: 0, paddingTop: 1 }}>Schedule</div>
                  <div style={{ fontSize: 15 }}>{c.schedule}</div>
                </div>
              </div>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
}
