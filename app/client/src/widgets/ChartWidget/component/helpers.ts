import { get } from "lodash";
import type {
  ChartType,
  ChartSelectedDataPoint,
  AllChartData,
} from "../constants";
import { omit, cloneDeep } from "lodash";

export const parseOnDataPointClickParams = (evt: any, chartType: ChartType) => {
  switch (chartType) {
    case "CUSTOM_FUSION_CHART": {
      return parseOnDataPointClickForCustomFusionChart(evt);
    }
    case "CUSTOM_ECHART": {
      return parseOnDataPointClickForCustomEChart(evt);
    }
    default: {
      return parseOnDataPointClickForBasicCharts(evt);
    }
  }
};

export const parseOnDataPointClickForCustomEChart = (
  evt: Record<string, unknown>,
): ChartSelectedDataPoint => {
  const rawEventData = omit(cloneDeep(evt), "event");
  return {
    x: undefined,
    y: undefined,
    seriesTitle: undefined,
    rawEventData: rawEventData,
  };
};

export const parseOnDataPointClickForCustomFusionChart = (
  evt: Record<string, unknown>,
): ChartSelectedDataPoint => {
  const data = evt.data as Record<string, unknown>;
  const seriesTitle = get(data, "datasetName", undefined);

  return {
    x: data.categoryLabel,
    y: data.dataValue,
    seriesTitle,
    rawEventData: data,
  } as ChartSelectedDataPoint;
};

export const parseOnDataPointClickForBasicCharts = (
  evt: Record<string, unknown>,
): ChartSelectedDataPoint => {
  const data: unknown[] = evt.data as unknown[];
  const x: unknown = data[0];

  const seriesIndex: number = evt.seriesIndex as number;
  const index = (seriesIndex ?? 0) + 1;
  const y: unknown = data[index];

  const seriesName: string | undefined = evt.seriesName as string;

  return {
    x: x,
    y: y,
    seriesTitle: seriesName,
  } as ChartSelectedDataPoint;
};

export const maxLabelLengthForChart = (
  axisName: "xAxis" | "yAxis",
  chartType: ChartType,
  seriesConfigs: AllChartData,
) => {
  const labelKey = labelKeyForChart(axisName, chartType);
  const seriesIDs = Object.keys(seriesConfigs);

  let maxLabelLength = 0;
  let maxLabelString = "";

  for (const seriesID of seriesIDs) {
    const datapoints = seriesConfigs[seriesID].data;
    for (const datapoint of datapoints) {
      const label: string = datapoint[labelKey].toString();
      if (label.length > maxLabelLength) {
        maxLabelLength = label.length;
        maxLabelString = label;
      }
    }
  }
  return maxLabelString;
};

const labelKeyForChart = (
  axisName: "xAxis" | "yAxis",
  chartType: ChartType,
): "x" | "y" => {
  let labelKey: "x" | "y";

  if (axisName == "xAxis") {
    labelKey = chartType == "BAR_CHART" ? "y" : "x";
  } else {
    labelKey = chartType == "BAR_CHART" ? "x" : "y";
  }
  return labelKey;
};

export const getTextWidth = (text: string, font: string) => {
  // re-use canvas object for better performance
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  if (context) {
    context.font = font;
    const metrics = context.measureText(text);
    return metrics.width;
  } else {
    return 0;
  }
};
