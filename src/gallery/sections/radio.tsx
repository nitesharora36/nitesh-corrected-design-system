"use client";

import { Avatar } from "@/components/ds/avatar";
import { Badge } from "@/components/ds/badge";
import type { ChoiceCardContent } from "@/components/ds/checkbox";
import { KeyIcon } from "@/components/ds/key-components";
import { LinkButton } from "@/components/ds/link-button";
import { Radio, RadioCard, RadioGroup, RadioLabel } from "@/components/ds/radio";
import { UserIcon } from "@/components/ui/icons";
import { Group, Labelled } from "../parts";

const VALUES = [
  { id: "off", label: "Off" },
  { id: "on", label: "On" },
] as const;
const STATES = [
  { id: "default", label: "Default" },
  { id: "hover", label: "Hover" },
  { id: "focus", label: "Focused" },
  { id: "disabled", label: "Disabled" },
] as const;

/** The Badge on the title line: Light, Blue, turning Gray when disabled (checkbox.md). */
const badge = (disabled?: boolean) => (
  <Badge size="sm" variant="light" color={disabled ? "gray" : "blue"}>
    New
  </Badge>
);

/** The link under the description: the Link Button, Primary, Small (16). */
const link = (disabled?: boolean) => (
  <LinkButton variant="primary" size="sm" underline disabled={disabled}>
    Learn more
  </LinkButton>
);

/** The six card types, each with its picture on the left. The brand and
 *  company logos are files in public/brand; a grey card stands in for a card
 *  brand's logo until its artwork is added. */
const CARD_TYPES: { value: string; caption: string; card: ChoiceCardContent }[] = [
  { value: "basic", caption: "Basic", card: { type: "basic", title: "Team", sublabel: "(Up to 20)", description: "For a team trying it out." } },
  {
    value: "left-icon",
    caption: "Left Icon (a Key Icon, 40)",
    card: {
      type: "left-icon",
      picture: (
        <KeyIcon size="md">
          <UserIcon />
        </KeyIcon>
      ),
      title: "Members",
      description: "Everyone in the workspace.",
    },
  },
  {
    value: "avatar",
    caption: "Avatar (40)",
    card: { type: "avatar", picture: <Avatar size="40" name="Nitesh Arora" color="blue" />, title: "Nitesh Arora", sublabel: "(You)", description: "Product designer" },
  },
  {
    value: "card-provider",
    caption: "Card Provider (a logo, 32 x 24)",
    card: { type: "card-provider", picture: <span className="size-full bg-bg-soft-200" />, title: "Card ending 4242", description: "Expires 08/28" },
  },
  {
    value: "brand",
    caption: "Brand (a logo, 40)",
    // eslint-disable-next-line @next/next/no-img-element
    card: { type: "brand", picture: <img src="/brand/slack.svg" alt="" />, title: "Slack", description: "Post run alerts to a channel." },
  },
  {
    value: "company",
    caption: "Company (a logo, 40)",
    // eslint-disable-next-line @next/next/no-img-element
    card: { type: "company", picture: <img src="/brand/microsoft.svg" alt="" />, title: "Microsoft", description: "Sign in with your work account." },
  },
];

export function RadioSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="The button, every value and state">
        <div className="grid grid-cols-[repeat(4,max-content)] gap-x-space-32 gap-y-space-16">
          {VALUES.map((v) =>
            STATES.map((s) => (
              <Labelled key={`${v.id}-${s.id}`} label={`${v.label}, ${s.label}`}>
                {/* Each in its own group, so each keeps its own value. */}
                <RadioGroup defaultValue={v.id === "on" ? "a" : undefined} aria-label={`${v.label}, ${s.label}`}>
                  <Radio
                    value="a"
                    data-force={s.id === "hover" || s.id === "focus" ? s.id : undefined}
                    disabled={s.id === "disabled"}
                    aria-label={`${v.label}, ${s.label}`}
                  />
                </RadioGroup>
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Radio Label">
        <div className="flex flex-wrap items-start gap-x-space-48 gap-y-space-24">
          <Labelled label="One line; (Sublabel) and Badge; Disabled, Badge Gray (ours)">
            <RadioGroup defaultValue="monthly" aria-label="Billing" className="flex flex-col gap-space-12">
              <RadioLabel value="monthly" label="Monthly" />
              <RadioLabel value="yearly" label="Yearly" sublabel="(Save 20%)" badge={badge()} />
              <RadioLabel value="custom" label="Custom" badge={badge(true)} disabled />
            </RadioGroup>
          </Labelled>
          <Labelled label="With description; Badge and link; Disabled (ours)">
            <RadioGroup defaultValue="team" aria-label="Access" className="flex flex-col gap-space-16">
              <RadioLabel value="team" label="Team" description="Everyone in the workspace can open it." />
              <RadioLabel value="private" label="Private" sublabel="(Only you)" badge={badge()} description="Only you can open it." link={link()} />
              <RadioLabel value="locked" label="Locked" badge={badge(true)} description="Nobody can change it." link={link(true)} disabled />
            </RadioGroup>
          </Labelled>
          <Labelled label="Flip; with description and link">
            <RadioGroup defaultValue="email" aria-label="Send by" className="flex flex-col gap-space-12">
              <RadioLabel value="email" label="Email" flip />
              <RadioLabel value="slack" label="Slack" description="Post to a channel." link={link()} flip />
            </RadioGroup>
          </Labelled>
        </div>
      </Group>

      <Group label="Radio Card, Basic: Default, Hover, Active, Disabled">
        <RadioGroup defaultValue="business" aria-label="Plan" className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Default">
            <RadioCard className="w-90" value="starter" title="Starter" sublabel="(Free)" badge={badge()} description="For one person trying it out." />
          </Labelled>
          <Labelled label="Hover">
            <RadioCard className="w-90" value="team" title="Team" badge={badge()} description="For a team of up to 20." data-force="hover" />
          </Labelled>
          <Labelled label="Active">
            <RadioCard className="w-90" value="business" title="Business" badge={badge()} description="For the whole company." />
          </Labelled>
          <Labelled label="Disabled, Badge Gray">
            <RadioCard className="w-90" value="enterprise" title="Enterprise" badge={badge(true)} description="Talk to us first." disabled />
          </Labelled>
        </RadioGroup>
      </Group>

      <Group label="Radio Card, every type (pick one)">
        <RadioGroup defaultValue="avatar" aria-label="Card types" className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {CARD_TYPES.map(({ value, caption, card }) => (
            <Labelled key={value} label={caption}>
              <RadioCard {...card} className="w-90" value={value} />
            </Labelled>
          ))}
        </RadioGroup>
      </Group>
    </div>
  );
}
