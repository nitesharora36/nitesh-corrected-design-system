"use client";

import { KpiCard } from "@/components/ds/kpi-card";
import { AlertIcon, BellIcon, BuildingIcon, ClockIcon, DataStudioIcon, UserIcon } from "@/components/ui/icons";
import { Group } from "../parts";

// Example numbers for a data centre group: illustrative, not real.
const WEEKS = Array.from({ length: 12 }, (_, i) => `Week ${i + 30}`);
const MONTHS = ["Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct"];

export function KpiCardSection() {
  return (
    <div className="flex flex-col gap-space-40">
      <Group label="Every picture: sparkline, mini bars, gauge, breakdown (hover a picture)">
        <div className="grid grid-cols-1 gap-space-16 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard
            label="Agent runs"
            icon={<DataStudioIcon />}
            value="12.9K"
            change={{ value: 8.4, good: "up" }}
            period="vs last month"
            trend={{ type: "line", data: [8.1, 8.6, 8.4, 9.2, 9.9, 9.7, 10.4, 11.1, 10.8, 11.6, 12.2, 12.9], labels: MONTHS }}
            format={(v) => `${v}K`}
          />
          <KpiCard
            label="Incidents"
            icon={<AlertIcon />}
            value="23"
            change={{ value: -12, good: "down" }}
            period="vs last week"
            trend={{ type: "bars", data: [31, 28, 34, 29, 27, 30, 26, 24, 28, 25, 26, 23], labels: WEEKS }}
          />
          <KpiCard
            label="Capacity used"
            icon={<BuildingIcon />}
            value="72%"
            change={{ value: 4.1, good: "down" }}
            period="vs last month"
            trend={{ type: "gauge", value: 72 }}
          />
          <KpiCard
            label="Storage"
            value="100 TB"
            change={{ value: 2.1, good: "up" }}
            period="vs last month"
            trend={{
              type: "breakdown",
              items: [
                { label: "Hot", value: 42 },
                { label: "Warm", value: 31 },
                { label: "Cold", value: 18 },
                { label: "Archive", value: 9 },
              ],
            }}
            format={(v) => `${v} TB`}
          />
        </div>
      </Group>

      <Group label="The change: good up, bad up, good down, flat, none">
        <div className="grid grid-cols-1 gap-space-16 md:grid-cols-3">
          <KpiCard label="Revenue" value="$1.24M" change={{ value: 8.4, good: "up" }} period="vs last month" />
          <KpiCard label="Cost" icon={<BellIcon />} value="$486K" change={{ value: 6.2, good: "down" }} period="vs last month" />
          <KpiCard label="Mean time to repair" icon={<ClockIcon />} value="38 min" change={{ value: -14, good: "down" }} period="vs last month" />
          <KpiCard label="Active users" icon={<UserIcon />} value="1,284" change={{ value: 0, good: "up" }} period="vs last week" />
          <KpiCard label="Sites" value="14" />
        </div>
      </Group>

      <Group label="Loading">
        <div className="grid grid-cols-1 gap-space-16 md:grid-cols-2 xl:grid-cols-4">
          <KpiCard label="Agent runs" value="" loading trend={{ type: "line", data: [] }} />
          <KpiCard label="Incidents" value="" loading trend={{ type: "bars", data: [] }} />
        </div>
      </Group>
    </div>
  );
}
