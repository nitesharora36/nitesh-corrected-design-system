"use client";

import { useState } from "react";

import { Avatar, AvatarGroup } from "@/components/ds/avatar";
import { Badge, StatusBadge, type StatusBadgeStatus } from "@/components/ds/badge";
import { Button } from "@/components/ds/button";
import { Checkbox } from "@/components/ds/checkbox";
import { CompactButton } from "@/components/ds/compact-button";
import { KeyIcon } from "@/components/ds/key-components";
import { ProgressBarLabel } from "@/components/ds/progress-bar";
import { Radio, RadioGroup } from "@/components/ds/radio";
import { RatingReview } from "@/components/ds/rating";
import { Switch } from "@/components/ds/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHeader,
  TableHeaderCell,
  TableLogo,
  TableRow,
  TableTextCell,
  type TablePriority,
  type TableSize,
  type TableSort,
} from "@/components/ds/table";
import { CopyIcon, DeleteIcon, FileIcon, GithubIcon, SlackIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

type Person = { id: string; name: string; email: string; role: string; team: string; status: StatusBadgeStatus; alerts: boolean };

const PEOPLE: Person[] = [
  { id: "ana", name: "Ana Silva", email: "ana@8bit.ai", role: "Admin", team: "Finance", status: "completed", alerts: true },
  { id: "ben", name: "Ben Okafor", email: "ben@8bit.ai", role: "Member", team: "Product", status: "pending", alerts: false },
  { id: "chloe", name: "Chloe Martin", email: "chloe@8bit.ai", role: "Member", team: "Design", status: "completed", alerts: true },
  { id: "dev", name: "Dev Patel", email: "dev@8bit.ai", role: "Viewer", team: "Sales", status: "failed", alerts: false },
  { id: "elena", name: "Elena Rossi", email: "elena@8bit.ai", role: "Member", team: "Finance", status: "disabled", alerts: false },
];

const TEAM_AVATARS = ["Grace Lee", "Hugo Laurent", "Ines Costa"];

/** The row action buttons: X-Large an icon-only Neutral Ghost X-Small (32),
 *  Large the Compact Button, Ghost, Large (24). */
function RowButton({ size, label, icon }: { size: TableSize; label: string; icon: React.ReactNode }) {
  return size === "xl" ? (
    <Button tone="neutral" variant="ghost" size="xs" leadingIcon={icon} aria-label={label} />
  ) : (
    <CompactButton variant="ghost" size="lg" aria-label={label}>
      {icon}
    </CompactButton>
  );
}

const NEXT_SORT: Record<TableSort, TableSort> = { default: "up", up: "down", down: "default" };

/** A full table you can use: tick rows (the header ticks them all), sort by
 *  name, flip the alerts. */
function MembersTable({ size }: { size: TableSize }) {
  const [picked, setPicked] = useState<string[]>(["chloe"]);
  const [sort, setSort] = useState<TableSort>("default");
  const [alerts, setAlerts] = useState<Record<string, boolean>>(Object.fromEntries(PEOPLE.map((p) => [p.id, p.alerts])));

  const rows = [...PEOPLE];
  if (sort !== "default") rows.sort((a, b) => (sort === "up" ? 1 : -1) * a.name.localeCompare(b.name));
  const all = picked.length === PEOPLE.length ? true : picked.length > 0 ? "indeterminate" : false;
  const xl = size === "xl";

  return (
    // The Leading column takes twice the free width of the others.
    <Table size={size} columns={["minmax(var(--table-col-leading-min), 2fr)", "fill", "fill", "status-badge", "badge-group", "avatar-group", "toggle", "button-group"]}>
      <TableHeader>
        <TableHeaderCell
          sticky
          checkbox={<Checkbox aria-label="Pick every row" checked={all} onCheckedChange={(v) => setPicked(v === true ? PEOPLE.map((p) => p.id) : [])} />}
          sort={sort}
          onSort={() => setSort(NEXT_SORT[sort])}
        >
          Name
        </TableHeaderCell>
        <TableHeaderCell>Role</TableHeaderCell>
        <TableHeaderCell>Team</TableHeaderCell>
        <TableHeaderCell>Status</TableHeaderCell>
        <TableHeaderCell>Tags</TableHeaderCell>
        <TableHeaderCell>Shared with</TableHeaderCell>
        <TableHeaderCell>Alerts</TableHeaderCell>
        <TableHeaderCell />
      </TableHeader>
      <TableBody>
        {rows.map((p) => {
          const on = picked.includes(p.id);
          return (
            <TableRow key={p.id} selected={on}>
              <TableTextCell
                sticky
                priority="leading"
                control={
                  <Checkbox
                    aria-label={`Pick ${p.name}`}
                    checked={on}
                    onCheckedChange={(v) => setPicked((now) => (v === true ? [...now, p.id] : now.filter((id) => id !== p.id)))}
                  />
                }
                picture={<Avatar size={xl ? "40" : "24"} name={p.name} />}
                title={p.name}
                description={p.email}
              />
              <TableTextCell title={p.role} description="Since March" />
              <TableTextCell priority="passive" title={p.team} description="4 workspaces" />
              <TableCell>
                <StatusBadge status={p.status} variant="stroke" />
              </TableCell>
              <TableCell>
                <Badge variant="lighter" color="blue">
                  Design
                </Badge>
                <Badge variant="lighter" color="orange">
                  Finance
                </Badge>
                <Badge variant="lighter" color="gray">
                  +4
                </Badge>
              </TableCell>
              <TableCell>
                <AvatarGroup size="24" more={9}>
                  {TEAM_AVATARS.map((n) => (
                    <Avatar key={n} name={n} />
                  ))}
                </AvatarGroup>
              </TableCell>
              <TableCell align="center">
                <Switch aria-label={`Alerts for ${p.name}`} checked={alerts[p.id]} onCheckedChange={(v) => setAlerts((a) => ({ ...a, [p.id]: v }))} />
              </TableCell>
              <TableCell align="right">
                <RowButton size={size} label={`Copy ${p.name}'s email`} icon={<CopyIcon />} />
                <RowButton size={size} label={`Remove ${p.name}`} icon={<DeleteIcon />} />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

const PRIORITIES: { id: TablePriority; label: string }[] = [
  { id: "leading", label: "Leading" },
  { id: "regular", label: "Regular" },
  { id: "passive", label: "Passive" },
];

// Card provider and file format pictures wait for their images. The logos are
// Hugeicons stand-ins.
const PROJECTS = [
  { id: "q3", name: "Q3 revenue review", rating: 4.5, done: 80 },
  { id: "soc", name: "SOC 2 evidence", rating: 3, done: 45 },
  { id: "dc", name: "Data centre move", rating: 5, done: 100 },
];

/** The Rating cell (stars only, 132) and the Progress Bar cell (the value on
 *  the right, 196), as table.md lists them. */
function ScoresTable({ size }: { size: TableSize }) {
  return (
    <Table size={size} columns={["minmax(var(--table-col-leading-min), 2fr)", "rating", "progress-bar"]}>
      <TableHeader>
        <TableHeaderCell>Project</TableHeaderCell>
        <TableHeaderCell>Rating</TableHeaderCell>
        <TableHeaderCell>Progress</TableHeaderCell>
      </TableHeader>
      <TableBody>
        {PROJECTS.map((p) => (
          <TableRow key={p.id}>
            <TableTextCell priority="leading" title={p.name} description={size === "xl" ? "Finance workspace" : undefined} />
            <TableCell>
              <RatingReview value={p.rating} label={`${p.name}, rated ${p.rating} out of 5`} />
            </TableCell>
            <TableCell>
              <ProgressBarLabel type="right" title={`${p.name}, progress`} value={p.done} />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function TableSection() {
  const [opened, setOpened] = useState("");

  return (
    <div className="flex flex-col gap-space-40">
      <Group label="X-Large 64: try it (tick rows, sort by name, flip the alerts)">
        <MembersTable size="xl" />
      </Group>

      <Group label="Large 48: try it">
        <MembersTable size="lg" />
      </Group>

      <Group label="Rating and Progress Bar cells, X-Large 64 and Large 48">
        <ScoresTable size="xl" />
        <ScoresTable size="lg" />
      </Group>

      <Group label="Header cell: every state and extra">
        <Table columns={["fill", "fill", "fill", "fill", "fill", "fill", "button"]}>
          <TableHeader>
            <TableHeaderCell>Default</TableHeaderCell>
            <TableHeaderCell checkbox={<Checkbox aria-label="Pick every row" />}>Checkbox</TableHeaderCell>
            <TableHeaderCell sort="default" onSort={() => {}}>
              Sort
            </TableHeaderCell>
            <TableHeaderCell sort="up" onSort={() => {}}>
              Sort up
            </TableHeaderCell>
            <TableHeaderCell sort="down" onSort={() => {}}>
              Sort down
            </TableHeaderCell>
            <TableHeaderCell sort="default" onSort={() => {}} data-force="focus">
              Sort, Focus
            </TableHeaderCell>
            <TableHeaderCell />
          </TableHeader>
        </Table>
        <Table columns={["fill", "fill", "fill"]}>
          <TableHeader>
            <TableHeaderCell disabled>Disabled</TableHeaderCell>
            <TableHeaderCell disabled checkbox={<Checkbox aria-label="Pick every row" disabled />}>
              Disabled, checkbox
            </TableHeaderCell>
            <TableHeaderCell disabled sort="default" onSort={() => {}}>
              Disabled, sort
            </TableHeaderCell>
          </TableHeader>
        </Table>
        <p className="text-paragraph-xs text-text-soft-400">The last cell of the first header is Empty: 64 wide, over a column of buttons.</p>
      </Group>

      {(["xl", "lg"] as const).map((size) => (
        <Group key={size} label={`Row states, ${size === "xl" ? "X-Large 64" : "Large 48"}`}>
          <Table size={size} columns={["fill", "fill", "button"]}>
            <TableHeader>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>State</TableHeaderCell>
              <TableHeaderCell />
            </TableHeader>
            <TableBody>
              {[
                { id: "default", label: "Default", on: false },
                { id: "hover", label: "Hover", on: false },
                { id: "active", label: "Active (picked)", on: true },
                { id: "focus", label: "Focus (ours: a row that opens something)", on: false },
              ].map((r) => (
                <TableRow
                  key={r.id}
                  selected={r.on}
                  data-force={r.id === "hover" || r.id === "focus" ? r.id : undefined}
                  onClick={r.id === "focus" ? () => setOpened(`Opened ${r.label}`) : undefined}
                >
                  <TableTextCell
                    priority="leading"
                    control={<Checkbox aria-label={`Pick ${r.label}`} defaultChecked={r.on} />}
                    picture={
                      <KeyIcon size={size === "xl" ? "md" : "sm"}>
                        <FileIcon />
                      </KeyIcon>
                    }
                    title="Q3 revenue.xlsx"
                    description="2.4 MB"
                  />
                  <TableTextCell priority="passive" title={r.label} />
                  <TableCell align="center">
                    <RowButton size={size} label="Remove Q3 revenue.xlsx" icon={<DeleteIcon />} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Group>
      ))}
      {opened && <p className="text-paragraph-xs text-text-soft-400">{opened}</p>}

      {(["xl", "lg"] as const).map((size) => (
        <Group key={size} label={`Text cells, ${size === "xl" ? "X-Large 64 (title and description)" : "Large 48 (title only)"}: weights and pictures`}>
          <Table size={size} columns={["fill", "fill", "fill"]}>
            <TableHeader>
              {PRIORITIES.map((p) => (
                <TableHeaderCell key={p.id}>{p.label}</TableHeaderCell>
              ))}
            </TableHeader>
            <TableBody>
              <TableRow>
                {PRIORITIES.map((p) => (
                  <TableTextCell key={p.id} priority={p.id} title="Words only" description="A description line" />
                ))}
              </TableRow>
              <TableRow>
                {PRIORITIES.map((p) => (
                  <TableTextCell
                    key={p.id}
                    priority={p.id}
                    control={<Checkbox aria-label="Pick" />}
                    picture={
                      <KeyIcon size={size === "xl" ? "md" : "sm"}>
                        <FileIcon />
                      </KeyIcon>
                    }
                    title="Checkbox, Key Icon"
                    description="Q3 revenue.xlsx"
                  />
                ))}
              </TableRow>
              <TableRow>
                {PRIORITIES.map((p) => (
                  <TableTextCell
                    key={p.id}
                    priority={p.id}
                    control={
                      <RadioGroup defaultValue="" aria-label="Pick one">
                        <Radio value={p.id} aria-label="Pick" />
                      </RadioGroup>
                    }
                    picture={<Avatar size={size === "xl" ? "40" : "24"} name="Ana Silva" />}
                    title="Radio, Avatar"
                    description="ana@8bit.ai"
                  />
                ))}
              </TableRow>
              <TableRow>
                {PRIORITIES.map((p, i) => (
                  <TableTextCell
                    key={p.id}
                    priority={p.id}
                    picture={<TableLogo>{i % 2 === 0 ? <SlackIcon /> : <GithubIcon />}</TableLogo>}
                    title="Brand logo, in a circle"
                    description="A very long description that ends in three dots when it runs out of room"
                  />
                ))}
              </TableRow>
            </TableBody>
          </Table>
        </Group>
      ))}

      <Group label="Long table (ours): the header stays at the top while the rows scroll under it">
        <Table size="lg" columns={["fill", "fill", "status-badge", "button"]} className="h-scroll-figma">
          <TableHeader>
            <TableHeaderCell>Name</TableHeaderCell>
            <TableHeaderCell>Team</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell />
          </TableHeader>
          <TableBody>
            {[...PEOPLE, ...PEOPLE, ...PEOPLE].map((p, i) => (
              <TableRow key={`${p.id}-${i}`}>
                <TableTextCell priority="leading" picture={<Avatar size="24" name={p.name} />} title={p.name} />
                <TableTextCell priority="passive" title={p.team} />
                <TableCell>
                  <StatusBadge status={p.status} variant="stroke" />
                </TableCell>
                <TableCell align="center">
                  <RowButton size="lg" label={`Remove ${p.name}`} icon={<DeleteIcon />} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Group>
    </div>
  );
}
