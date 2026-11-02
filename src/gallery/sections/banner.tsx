"use client";

import * as React from "react";

import { Banner, BannerLink } from "@/components/ds/banner";
import type { AlertStatus, AlertVariant } from "@/components/ds/alert";
import { LinkButton } from "@/components/ds/link-button";
import { Group, Labelled } from "../parts";

const STATUSES: { id: AlertStatus; label: string; title: string; description: string }[] = [
  { id: "error", label: "Error", title: "System failure", description: "Some workflows are not running." },
  { id: "warning", label: "Warning", title: "Planned maintenance", description: "Neutrino is offline on Sunday from 02:00 to 04:00." },
  { id: "success", label: "Success", title: "All systems running", description: "Every workflow is back on schedule." },
  { id: "information", label: "Information", title: "Your trial ends soon", description: "Pick a plan to keep your workspace." },
  { id: "feature", label: "Feature", title: "New: Shared workflows", description: "Share a workflow with your team." },
];
const VARIANTS: { id: AlertVariant; label: string }[] = [
  { id: "filled", label: "Filled" },
  { id: "light", label: "Light" },
  { id: "lighter", label: "Lighter" },
  { id: "stroke", label: "Stroke" },
];

const noop = () => {};

export function BannerSection() {
  const [shown, setShown] = React.useState(true);

  return (
    <div className="flex flex-col gap-space-40">
      {VARIANTS.map((variant) => (
        <Group key={variant.id} label={`${variant.label}, every status`}>
          <div className="flex flex-col gap-space-16">
            {STATUSES.map((status) => (
              <Labelled key={status.id} label={`${variant.label}, ${status.label}`}>
                <Banner
                  variant={variant.id}
                  status={status.id}
                  title={status.title}
                  description={status.description}
                  link={<BannerLink>Learn more</BannerLink>}
                  onClose={noop}
                />
              </Labelled>
            ))}
          </div>
        </Group>
      ))}

      <Group label="Close icon: Default, Hover, Focus (proposed)">
        <div className="flex flex-col gap-space-16">
          {(["default", "hover", "focus"] as const).map((state) =>
            (["filled", "lighter"] as const).map((variant) => (
              <Labelled key={`${state}-${variant}`} label={`${variant === "filled" ? "Filled" : "Lighter"}, ${state === "default" ? "Default" : state === "hover" ? "Hover" : "Focus"}`}>
                <Banner
                  variant={variant}
                  status="information"
                  title="Your trial ends soon"
                  description="Pick a plan to keep your workspace."
                  link={<BannerLink>Learn more</BannerLink>}
                  onClose={noop}
                  closeButtonProps={state === "default" ? undefined : ({ "data-force": state } as React.ComponentProps<"button">)}
                />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Try it: close the banner">
        {shown ? (
          <Banner
            variant="stroke"
            status="warning"
            title="Planned maintenance"
            description="Neutrino is offline on Sunday from 02:00 to 04:00."
            link={<BannerLink>Learn more</BannerLink>}
            onClose={() => setShown(false)}
          />
        ) : (
          <LinkButton variant="primary" onClick={() => setShown(true)} className="w-fit">
            Show it again
          </LinkButton>
        )}
      </Group>
    </div>
  );
}
