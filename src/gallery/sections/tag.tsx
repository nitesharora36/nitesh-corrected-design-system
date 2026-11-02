"use client";

import { useState } from "react";

import { Avatar } from "@/components/ds/avatar";
import { Button } from "@/components/ds/button";
import { Tag } from "@/components/ds/tag";
import { BellIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VARIANTS = [
  { id: "stroke", label: "Stroke" },
  { id: "gray", label: "Gray" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "active", label: "Active" },
  { id: "disabled", label: "Disabled" },
  { id: "focus", label: "Focus" },
] as const;

const noop = () => {};

export function TagSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {VARIANTS.map((v) => (
        <Group key={v.id} label={`${v.label}, every state`}>
          <div className="grid grid-cols-[repeat(5,max-content)] gap-x-space-32 gap-y-space-16">
            {STATES.map((s) => (
              <Labelled key={`basic-${s.id}`} label={`Words only, ${s.label}`}>
                <Tag
                  variant={v.id}
                  active={s.id === "active"}
                  disabled={s.id === "disabled"}
                  data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                >
                  Members
                </Tag>
              </Labelled>
            ))}
            {STATES.map((s) => (
              <Labelled key={`full-${s.id}`} label={`Icon, count, close, ${s.label}`}>
                <Tag
                  variant={v.id}
                  active={s.id === "active"}
                  disabled={s.id === "disabled"}
                  data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                  picture={<UserIcon />}
                  count={4}
                  onDismiss={noop}
                >
                  Members
                </Tag>
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Types, Stroke">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Basic">
            <Tag>Overview</Tag>
          </Labelled>
          <Labelled label="Basic, count">
            <Tag count={4}>Overview</Tag>
          </Labelled>
          <Labelled label="Basic, close">
            <Tag onDismiss={noop}>Overview</Tag>
          </Labelled>
          <Labelled label="Left Icon">
            <Tag picture={<UserIcon />}>Members</Tag>
          </Labelled>
          <Labelled label="Left Icon, count, close">
            <Tag picture={<UserIcon />} count={12} onDismiss={noop}>
              Members
            </Tag>
          </Labelled>
          <Labelled label="Avatar, close">
            <Tag picture={<Avatar size="20" />} onDismiss={noop}>
              Nitesh Arora
            </Tag>
          </Labelled>
          <Labelled label="Brand">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Tag picture={<img src="/brand/slack.svg" alt="" />}>Slack</Tag>
          </Labelled>
          <Labelled label="Company, close">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <Tag picture={<img src="/brand/microsoft.svg" alt="" />} onDismiss={noop}>
              Microsoft
            </Tag>
          </Labelled>
        </div>
      </Group>

      <Group label="Close icon with keyboard focus">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Stroke">
            <Tag onDismiss={noop} dismissProps={{ "data-force": "focus" }}>
              Overview
            </Tag>
          </Labelled>
          <Labelled label="Gray">
            <Tag variant="gray" picture={<UserIcon />} onDismiss={noop} dismissProps={{ "data-force": "focus" }}>
              Members
            </Tag>
          </Labelled>
        </div>
      </Group>

      <Group label="Blue tone: a value from somewhere else (a chip in the step drawer)">
        <div className="flex flex-wrap items-end gap-space-32">
          <Labelled label="Default">
            <Tag tone="blue" variant="gray" picture={<BellIcon />}>
              Alarm: problem
            </Tag>
          </Labelled>
          <Labelled label="Hover">
            <Tag tone="blue" variant="gray" picture={<BellIcon />} data-force="hover">
              Alarm: problem
            </Tag>
          </Labelled>
          <Labelled label="Active">
            <Tag tone="blue" variant="gray" picture={<BellIcon />} active>
              Alarm: problem
            </Tag>
          </Labelled>
          <Labelled label="With the close icon">
            <Tag tone="blue" variant="gray" picture={<BellIcon />} onDismiss={noop}>
              Alarm: machine
            </Tag>
          </Labelled>
          <Labelled label="Disabled">
            <Tag tone="blue" variant="gray" picture={<BellIcon />} disabled>
              Alarm: machine
            </Tag>
          </Labelled>
        </div>
      </Group>

      <LiveTags />
    </div>
  );
}

const FILTERS = ["Overview", "Members", "Reports", "Settings"];

/** The real thing: press a tag to pick it, press its close icon to remove it. */
function LiveTags() {
  const [picked, setPicked] = useState<string[]>(["Members"]);
  const [kept, setKept] = useState(FILTERS);
  const toggle = (name: string) => setPicked((p) => (p.includes(name) ? p.filter((x) => x !== name) : [...p, name]));
  return (
    <Group label="Try it: pick, tab to, and remove">
      <div className="flex flex-col gap-space-16">
        <div className="flex flex-wrap gap-space-8">
          {FILTERS.map((name) => (
            <Tag key={name} variant="gray" active={picked.includes(name)} onClick={() => toggle(name)}>
              {name}
            </Tag>
          ))}
        </div>
        <div className="flex flex-wrap gap-space-8">
          {kept.map((name) => (
            <Tag key={name} onDismiss={() => setKept((k) => k.filter((x) => x !== name))} dismissLabel={`Remove ${name}`}>
              {name}
            </Tag>
          ))}
          {kept.length === 0 && (
            <Button tone="neutral" variant="ghost" size="2xs" onClick={() => setKept(FILTERS)}>
              Bring them back
            </Button>
          )}
        </div>
      </div>
    </Group>
  );
}
