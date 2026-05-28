import { IndexBlock } from './IndexBlock';

export interface StageRecord {
  stageNumber: number | string;
  region: string;
  country?: string;
  distance: string | number;     // already formatted, e.g. "104 km"
  date?: string;
  startCoord?: string;            // e.g. "43.7102°N · 7.2620°E"
  endCoord?: string;
  status?: string;
}

interface StageDataProps {
  stage: StageRecord;
  className?: string;
}

/**
 * Standard stage metadata block, rendered as a mono index table.
 * Slot anywhere a stage appears: stage detail, archive row expand, popovers.
 */
export const StageData = ({ stage, className }: StageDataProps) => {
  const rows = [
    { label: 'Stage', value: `№ ${String(stage.stageNumber).padStart(3, '0')}` },
    { label: 'Region', value: stage.region },
    ...(stage.country ? [{ label: 'Country', value: stage.country }] : []),
    { label: 'Distance', value: typeof stage.distance === 'number' ? `${stage.distance} km` : stage.distance },
    ...(stage.date ? [{ label: 'Date', value: stage.date }] : []),
    ...(stage.startCoord ? [{ label: 'Start', value: stage.startCoord }] : []),
    ...(stage.endCoord ? [{ label: 'End', value: stage.endCoord }] : []),
    ...(stage.status ? [{ label: 'Status', value: stage.status }] : []),
  ];

  return <IndexBlock rows={rows} caption={`SYSTEM · STAGE ${String(stage.stageNumber).padStart(3, '0')}`} className={className} />;
};
