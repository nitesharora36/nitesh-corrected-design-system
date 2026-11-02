"use client";

import { useState } from "react";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import { Button } from "@/components/ds/button";
import {
  ChartLegend,
  ContentCard,
  ContentLabel,
  KeyIcon,
  LegendDot,
  PasswordStrength,
  type KeyColor,
  type LegendColor,
  type PasswordStrengthLevel,
} from "@/components/ds/key-components";
import { BellIcon, UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const KEY_SIZES = [
  { id: "2xl", label: "2X-Large 64" },
  { id: "xl", label: "X-Large 56" },
  { id: "lg", label: "Large 48" },
  { id: "md", label: "Medium 40" },
  { id: "sm", label: "Small 32" },
] as const;
const COLORS: { id: KeyColor; label: string }[] = [
  { id: "gray", label: "Gray" },
  { id: "blue", label: "Blue" },
  { id: "orange", label: "Orange" },
  { id: "red", label: "Red" },
  { id: "green", label: "Green" },
];
const LEGEND_COLORS: { id: LegendColor; label: string }[] = [
  ...COLORS,
  { id: "light-gray", label: "Light Gray" },
  { id: "disabled", label: "Disabled" },
];
const STRENGTHS: { id: PasswordStrengthLevel; label: string }[] = [
  { id: "empty", label: "Empty" },
  { id: "weak", label: "Weak" },
  { id: "moderate", label: "Moderate" },
  { id: "strong", label: "Strong" },
];
const CONDITIONS = ["At least 1 uppercase", "At least 1 number", "At least 8 characters"];

/** Which conditions are met at each strength, for the still examples. */
const MET: Record<PasswordStrengthLevel, boolean[]> = {
  empty: [false, false, false],
  weak: [true, false, false],
  moderate: [true, true, false],
  strong: [true, true, true],
};

export function KeyComponentsSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {(["stroke", "lighter"] as const).map((variant) => (
        <Group key={variant} label={`Key Icons, ${variant === "stroke" ? "Stroke" : "Lighter"}, every size and colour`}>
          <div className="flex flex-col gap-space-16">
            {COLORS.map((c) => (
              <div key={c.id} className="flex flex-wrap items-end gap-space-24">
                {KEY_SIZES.map((s) => (
                  <Labelled key={s.id} label={`${c.label}, ${s.label}`}>
                    <KeyIcon size={s.id} variant={variant} color={c.id}>
                      <BellIcon />
                    </KeyIcon>
                  </Labelled>
                ))}
              </div>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Content Label, Medium 40 and Large 48">
        <div className="grid max-w-3xl grid-cols-2 gap-x-space-32 gap-y-space-24">
          {(["md", "lg"] as const).map((size) => (
            <div key={size} className="flex flex-col gap-space-24">
              <Labelled label={`${size === "md" ? "Medium" : "Large"}, words only`}>
                <ContentLabel size={size} title="Members" sublabel="Optional" description="Who can open this workspace" />
              </Labelled>
              <Labelled label="With a Key Icon">
                <ContentLabel
                  size={size}
                  picture={
                    <KeyIcon size={size} color="blue">
                      <UserIcon />
                    </KeyIcon>
                  }
                  title="Members"
                  description="Who can open this workspace"
                />
              </Labelled>
              <Labelled label="With an Avatar and a Badge">
                <ContentLabel
                  size={size}
                  picture={<Avatar size={size === "md" ? "40" : "48"} name="Nitesh Arora" color="blue" />}
                  title="Nitesh Arora"
                  sublabel="You"
                  description="Product designer"
                  trailing={
                    <Badge variant="lighter" color="green">
                      Owner
                    </Badge>
                  }
                />
              </Labelled>
              <Labelled label="With a brand logo">
                <ContentLabel
                  size={size}
                  // eslint-disable-next-line @next/next/no-img-element
                  picture={<img src="/brand/slack.svg" alt="" />}
                  title="Slack"
                  description="Send alerts to a channel"
                />
              </Labelled>
            </div>
          ))}
        </div>
      </Group>

      <LiveContentCards />

      <Group label="Password Strength, every strength">
        <div className="grid max-w-3xl grid-cols-2 gap-x-space-32 gap-y-space-24">
          {STRENGTHS.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <PasswordStrength
                className="w-full"
                strength={s.id}
                typing={s.id !== "empty"}
                conditions={CONDITIONS.map((label, i) => ({ label, met: MET[s.id][i] }))}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Chart Legends and Legend Dots">
        <div className="flex flex-col gap-space-16">
          <div className="flex flex-wrap items-center gap-space-16">
            {LEGEND_COLORS.map((c) => (
              <ChartLegend key={c.id} color={c.id} disabled={c.id === "disabled"}>
                {c.label}
              </ChartLegend>
            ))}
          </div>
          <div className="flex flex-wrap items-end gap-space-24">
            {(["md", "sm"] as const).map((size) => (
              <Labelled key={size} label={size === "md" ? "Dots, Medium (20 box)" : "Dots, Small (16 box)"}>
                <div className="flex items-center gap-space-4">
                  {LEGEND_COLORS.map((c) => (
                    <LegendDot key={c.id} size={size} color={c.id} />
                  ))}
                </div>
              </Labelled>
            ))}
          </div>
        </div>
      </Group>
    </div>
  );
}

const CARDS = [
  { id: "slack", title: "Slack", description: "Send alerts to a channel", logo: "/brand/slack.svg" },
  { id: "notion", title: "Notion", description: "Read pages from a workspace", logo: "/brand/notion.svg" },
];

/** Content Cards with a working close icon. */
function LiveContentCards() {
  const [shown, setShown] = useState(CARDS.map((c) => c.id));
  return (
    <Group label="Content Card (press the close icon)">
      <div className="flex max-w-sm flex-col gap-space-12">
        <ContentCard
          picture={
            <KeyIcon size="md">
              <UserIcon />
            </KeyIcon>
          }
          title="Members"
          sublabel="Optional"
          description="Who can open this workspace"
        />
        {CARDS.filter((c) => shown.includes(c.id)).map((c) => (
          <ContentCard
            key={c.id}
            // eslint-disable-next-line @next/next/no-img-element
            picture={<img src={c.logo} alt="" />}
            title={c.title}
            description={c.description}
            onClose={() => setShown((s) => s.filter((x) => x !== c.id))}
            closeLabel={`Remove ${c.title}`}
          />
        ))}
        {shown.length < CARDS.length && (
          <div>
            <Button tone="neutral" variant="ghost" size="2xs" onClick={() => setShown(CARDS.map((c) => c.id))}>
              Bring them back
            </Button>
          </div>
        )}
      </div>
    </Group>
  );
}
