

## Problem

The X-axis on the trend charts uses Recharts' default `category` scale, which spaces dates evenly regardless of the actual time gaps between them. So if you played on Jan 1, Jan 2, and Jan 31, those three points would be equally spaced — making it look like Jan 2 to Jan 31 is the same distance as Jan 1 to Jan 2.

## Solution

Convert the X-axis to a **time-based numeric scale** so the spacing between points reflects actual calendar distance.

### Changes

**`src/hooks/useGameStats.ts`** — Add a numeric timestamp field to each trend data point (e.g. `ts: new Date(date).getTime()`) alongside the existing `date` string. This gives Recharts a proper numeric value to scale against.

**`src/components/stats/TrendsSection.tsx`** — For all three `LineChart` instances:
1. Switch `XAxis` from `dataKey="date"` to `dataKey="ts"` with `type="number"` and `scale="time"` and `domain={['dataMin', 'dataMax']}`.
2. Update `tickFormatter` to convert the timestamp back to a readable date label (e.g. `MM/DD`).
3. The axis will now auto-scale: dates that are far apart get proportionally more space, dates that are close together stay close.

No visual or styling changes — just correcting the spatial accuracy of the X-axis.

