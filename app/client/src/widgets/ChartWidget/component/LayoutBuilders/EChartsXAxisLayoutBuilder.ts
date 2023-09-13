import { LabelOrientation } from "widgets/ChartWidget/constants";
import type { AllChartData, ChartType } from "widgets/ChartWidget/constants";
import { getTextWidth, maxLabelLengthForChart } from "../helpers";

interface XAxisLayoutBuilderParams {
  labelOrientation: LabelOrientation;
  chartType: ChartType;
  seriesConfigs: AllChartData;
  font: string;
}
export class EChartsXAxisLayoutBuilder {
  props: XAxisLayoutBuilderParams;

  gapBetweenLabelAndName = 10;
  defaultHeightForXAxisLabels = 30;
  defaultHeightForRotatedLabels = 50;
  defaultHeightForXAxisName = 40;

  constructor(props: XAxisLayoutBuilderParams) {
    this.props = props;
  }

  configForXAxis(width: number) {
    return {
      nameGap: width - this.defaultHeightForXAxisName,
      axisLabel: this.axisLabelConfig(width),
    };
  }

  axisLabelConfig = (width: number) => {
    if (this.props.labelOrientation == LabelOrientation.AUTO) {
      return {};
    } else {
      return {
        width:
          width - this.defaultHeightForXAxisName - this.gapBetweenLabelAndName,
        overflow: "truncate",
      };
    }
  };

  heightForXAxis = () => {
    if (this.props.chartType == "PIE_CHART") {
      return 0;
    } else {
      const result =
        this.heightForXAxisLabels() + this.defaultHeightForXAxisName;
      return result;
    }
  };

  heightForXAxisLabels = (): number => {
    let labelsHeight: number;

    if (this.props.labelOrientation == LabelOrientation.AUTO) {
      labelsHeight = this.defaultHeightForXAxisLabels;
    } else {
      labelsHeight = this.widthForXAxisLabels();
    }
    return labelsHeight + this.gapBetweenLabelAndName;
  };

  widthForXAxisLabels = () => {
    switch (this.props.labelOrientation) {
      case LabelOrientation.AUTO: {
        return 0;
      }
      default: {
        const maxLengthLabel = maxLabelLengthForChart(
          "xAxis",
          this.props.chartType,
          this.props.seriesConfigs,
        );
        return getTextWidth(maxLengthLabel, this.props.font);
      }
    }
  };

  heightConfigForLabels = () => {
    let minHeight = this.minHeightForLabels();
    const maxHeight = this.heightForXAxis();
    minHeight = minHeight > maxHeight ? maxHeight : minHeight;

    return {
      minHeight: minHeight,
      maxHeight: this.heightForXAxis(),
      height: minHeight,
    };
  };

  minHeightForLabels() {
    if (this.props.chartType == "PIE_CHART") {
      return 0;
    }

    let labelsHeight: number;
    if (this.props.labelOrientation == LabelOrientation.AUTO) {
      labelsHeight = this.defaultHeightForXAxisLabels;
    } else {
      labelsHeight = this.defaultHeightForRotatedLabels;
    }
    return (
      labelsHeight +
      this.gapBetweenLabelAndName +
      this.defaultHeightForXAxisName
    );
  }
}
