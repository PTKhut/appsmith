export type EChartElementLayoutParams = {
  elementName: string;
  height: number;
  minHeight: number;
  maxHeight: number;
  position: "top" | "bottom";
};

export type EChartElementVisibilityProps = {
  height: number;
  padding: number;
  minimumHeight: number;
  layoutConfigs: EChartElementLayoutParams[];
};
export class EChartElementVisibilityCalculator {
  props: EChartElementVisibilityProps;
  visibleElements: EChartElementLayoutParams[];

  constructor(props: EChartElementVisibilityProps) {
    this.props = props;
    this.visibleElements = this.selectElementsForVisibility();
  }

  needsCustomTopPadding() {
    return this.visibleElements.some((config) => config.position == "top");
  }

  needsCustomBottomPadding() {
    return this.visibleElements.some((config) => config.position == "bottom");
  }

  calculateOffsets() {
    let top = this.needsCustomTopPadding() ? this.props.padding : 0;
    let bottom = this.needsCustomBottomPadding() ? this.props.padding : 0;

    for (const config of this.visibleElements) {
      if (config.position == "top") {
        top += config.height;
      } else if (config.position == "bottom") {
        bottom += config.height;
      }
    }

    return {
      top: top,
      bottom: bottom,
    };
  }

  availableHeight() {
    return this.props.height - this.props.minimumHeight;
  }

  selectElementsForVisibility(): EChartElementLayoutParams[] {
    let remainingHeight = this.availableHeight();
    let index = 0;
    const count = this.props.layoutConfigs.length;

    const selectedElements: EChartElementLayoutParams[] = [];

    while (index < count && remainingHeight > 0) {
      const elementConfig = this.props.layoutConfigs[index];
      if (elementConfig.minHeight <= remainingHeight) {
        remainingHeight -= elementConfig.minHeight;

        selectedElements.push({
          height: elementConfig.minHeight,
          minHeight: elementConfig.minHeight,
          maxHeight: elementConfig.maxHeight,
          position: elementConfig.position,
          elementName: elementConfig.elementName,
        });

        index = index + 1;
      } else {
        break;
      }
    }

    for (const elementConfig of selectedElements) {
      if (remainingHeight > 0) {
        const height = this.assignExtraHeightToElementConfig(
          remainingHeight,
          elementConfig,
        );
        remainingHeight -= height;
        elementConfig.height += height;
      } else {
        break;
      }
    }
    return selectedElements;

    // const output : any = {
    //   top: [],
    //   bottom: []
    // }

    // for (const elementConfig of selectedElements) {
    //   if (elementConfig.position == "top") {
    //     output.top.push(elementConfig)
    //   } else {
    //     output.bottom.push(elementConfig)
    //   }
    // }
    // return output
  }

  assignExtraHeightToElementConfig(
    remainingHeight: number,
    elementConfig: EChartElementLayoutParams,
  ) {
    const difference = elementConfig.maxHeight - elementConfig.minHeight;
    if (remainingHeight > difference) {
      return difference;
    } else {
      return remainingHeight;
    }
  }
}
