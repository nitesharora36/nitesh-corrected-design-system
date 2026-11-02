"use client";

import * as React from "react";

import { Alert, AlertLink, AlertToaster, showToast, type AlertSize, type AlertStatus, type AlertVariant } from "@/components/ds/alert";
import { Button } from "@/components/ds/button";
import { Group, Labelled } from "../parts";

const STATUSES: { id: AlertStatus; label: string; title: string; description: string }[] = [
  { id: "error", label: "Error", title: "Database Connection Failure", description: "We could not reach the database. Check its settings and try again." },
  { id: "warning", label: "Warning", title: "Poor Network Connection", description: "Your changes are saved on this device until the connection is back." },
  { id: "success", label: "Success", title: "Changes saved.", description: "Everyone in the workspace now sees the new settings." },
  { id: "information", label: "Information", title: "App Version 2.0 Available", description: "A new version is ready, with faster search and new connectors." },
  { id: "feature", label: "Feature", title: "New: Shared workflows", description: "Share a workflow with your team and edit it together." },
];
const VARIANTS: { id: AlertVariant; label: string }[] = [
  { id: "filled", label: "Filled" },
  { id: "light", label: "Light" },
  { id: "lighter", label: "Lighter" },
  { id: "stroke", label: "Stroke" },
];
const ONE_LINE: { id: AlertSize; label: string }[] = [
  { id: "xs", label: "X-Small 32" },
  { id: "sm", label: "Small 36" },
];

const noop = () => {};

export function AlertSection() {
  return (
    <div className="flex flex-col gap-space-40">
      {/* Where the product's Toasts would appear: this page's own toaster. */}
      <AlertToaster />

      {ONE_LINE.map((size) => (
        <Group key={size.id} label={`${size.label}, every style and status`}>
          <div className="flex flex-wrap gap-x-space-24 gap-y-space-16">
            {STATUSES.map((status) =>
              VARIANTS.map((variant) => (
                <Labelled key={`${status.id}-${variant.id}`} label={`${variant.label}, ${status.label}`}>
                  <Alert
                    size={size.id}
                    variant={variant.id}
                    status={status.id}
                    title={status.title}
                    links={<AlertLink>Upgrade</AlertLink>}
                    onClose={noop}
                    className="w-alert-notification max-w-full"
                  />
                </Labelled>
              )),
            )}
          </div>
        </Group>
      ))}

      <Group label="Large, every style and status (a Notification is 390 wide)">
        <div className="flex flex-wrap items-start gap-x-space-24 gap-y-space-16">
          {VARIANTS.map((variant) => (
            <div key={variant.id} className="flex flex-col gap-space-16">
              {STATUSES.map((status) => (
                <Labelled key={status.id} label={`${variant.label}, ${status.label}`}>
                  <Alert
                    size="lg"
                    variant={variant.id}
                    status={status.id}
                    title={status.title}
                    description={status.description}
                    links={[<AlertLink key="upgrade">Upgrade</AlertLink>, <AlertLink key="more">Learn More</AlertLink>]}
                    onClose={noop}
                    className="w-alert-notification max-w-full"
                  />
                </Labelled>
              ))}
            </div>
          ))}
        </div>
      </Group>

      <Group label="Close icon: Default, Hover, Focus (proposed)">
        <div className="flex flex-wrap items-end gap-space-24">
          {(["default", "hover", "focus"] as const).map((state) =>
            (["filled", "lighter"] as const).map((variant) => (
              <Labelled key={`${state}-${variant}`} label={`${variant === "filled" ? "Filled" : "Lighter"}, ${state === "default" ? "Default" : state === "hover" ? "Hover" : "Focus"}`}>
                <Alert
                  size="sm"
                  variant={variant}
                  status="information"
                  title="App Version 2.0 Available"
                  onClose={noop}
                  closeButtonProps={state === "default" ? undefined : ({ "data-force": state } as React.ComponentProps<"button">)}
                />
              </Labelled>
            )),
          )}
        </div>
      </Group>

      <Group label="Alert, in the content: Error, Lighter, X-Small, full width (the Figma's Delete account dialog)">
        <div className="flex max-w-sm flex-col gap-space-12">
          <Alert size="xs" variant="lighter" status="error" title="This deletes every workspace you own." />
        </div>
      </Group>

      <Group label="Toast, bottom centre, 40 above the bottom of the screen (still)">
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-corner-12 border border-stroke-soft-200 bg-bg-page">
          <div className="absolute inset-x-0 bottom-alert-toast-bottom flex justify-center">
            <Alert size="sm" variant="stroke" status="success" title="Changes saved." onClose={noop} className="w-fit" />
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-space-12">
          <Button tone="neutral" variant="stroke" size="xs" onClick={() => showToast({ status: "success", title: "Changes saved." })}>
            Show a toast
          </Button>
          <Button
            tone="neutral"
            variant="stroke"
            size="xs"
            onClick={() => showToast({ status: "warning", variant: "lighter", title: "Poor Network Connection" })}
          >
            Show a Lighter toast
          </Button>
        </div>
      </Group>

      <Group label="Notification, bottom right, 32 in from the right and the bottom (still)">
        <div className="relative aspect-video w-full max-w-3xl overflow-hidden rounded-corner-12 border border-stroke-soft-200 bg-bg-page">
          <div className="absolute right-alert-notification-inset bottom-alert-notification-inset flex">
            <Alert
              size="lg"
              variant="filled"
              status="information"
              title="App Version 2.0 Available"
              description="A new version is ready, with faster search and new connectors."
              links={[<AlertLink key="upgrade">Upgrade</AlertLink>, <AlertLink key="more">Learn More</AlertLink>]}
              onClose={noop}
              className="w-alert-notification"
            />
          </div>
        </div>
      </Group>
    </div>
  );
}
