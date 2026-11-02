"use client";

import { TextArea, type TextAreaProps } from "@/components/ds/text-area";
import { Group, Labelled } from "../parts";

const NOTE = "Weekly numbers for the sales team, shared every Monday.";

const STATES: { id: string; label: string; props: Partial<TextAreaProps> }[] = [
  { id: "default", label: "Default (empty)", props: {} },
  { id: "hover", label: "Hover", props: { "data-force": "hover" } },
  { id: "focus", label: "Focus", props: { "data-force": "focus", defaultValue: NOTE } },
  { id: "filled", label: "Filled", props: { defaultValue: NOTE } },
  { id: "disabled", label: "Disabled", props: { disabled: true } },
  { id: "error", label: "Error", props: { error: true, defaultValue: "Sales" } },
  { id: "error-focus", label: "Error focused (ours)", props: { error: true, "data-force": "focus", defaultValue: "Sales" } },
];

export function TextAreaSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every state, with label, hint and counter">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          {STATES.map((s) => (
            <Labelled key={s.id} label={s.label}>
              <TextArea
                className="w-100"
                label="Description"
                optional
                info
                hint={s.props.error ? "Write at least 20 characters." : "Shown on the workspace page."}
                placeholder="What is this workspace for?"
                limit={200}
                {...s.props}
              />
            </Labelled>
          ))}
        </div>
      </Group>

      <Group label="Counter">
        <div className="flex flex-wrap items-start gap-x-space-32 gap-y-space-24">
          <Labelled label="Count and resize handle">
            <TextArea className="w-100" aria-label="Description" placeholder="What is this workspace for?" limit={200} />
          </Labelled>
          <Labelled label="Over the limit">
            <TextArea className="w-100" aria-label="Description" limit={20} defaultValue={NOTE} />
          </Labelled>
          <Labelled label="Disabled">
            <TextArea className="w-100" aria-label="Description" limit={200} defaultValue={NOTE} disabled />
          </Labelled>
          <Labelled label="Count only">
            <TextArea className="w-100" aria-label="Description" placeholder="What is this workspace for?" limit={200} resizable={false} />
          </Labelled>
          <Labelled label="Resize handle only">
            <TextArea className="w-100" aria-label="Description" placeholder="What is this workspace for?" />
          </Labelled>
          <Labelled label="No counter row">
            <TextArea className="w-100" aria-label="Description" placeholder="What is this workspace for?" resizable={false} />
          </Labelled>
        </div>
      </Group>
    </div>
  );
}
