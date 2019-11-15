import { Container } from 'unstated';

import loggerFactory from '@alias/logger';

import { toastError } from '../util/apiNotification';

// eslint-disable-next-line no-unused-vars
const logger = loggerFactory('growi:services:AdminCustomizeContainer');

/**
 * Service container for admin customize setting page (Customize.jsx)
 * @extends {Container} unstated Container
 */
export default class AdminCustomizeContainer extends Container {

  constructor(appContainer) {
    super();

    this.appContainer = appContainer;

    this.state = {
      // TODO GW-575 set data from apiV3
      currentTheme: appContainer.config.themeType,
      currentLayout: appContainer.config.layoutType,
      currentBehavior: appContainer.config.behaviorType,
      isEnabledTimeline: appContainer.config.isEnabledTimeline,
      isSavedStatesOfTabChanges: appContainer.config.isSavedStatesOfTabChanges,
      isEnabledAttachTitleHeader: appContainer.config.isEnabledAttachTitleHeader,
      currentRecentCreatedLimit: appContainer.config.recentCreatedLimit,
      currentHighlightJsStyleId: appContainer.config.highlightJsStyle,
      isHighlightJsStyleBorderEnabled: appContainer.config.highlightJsStyleBorder,
      currentCustomizeCss: appContainer.config.customizeCss,
      currentCustomizeScript: appContainer.config.customizeScript,
      highlightJsCssSelectorOptions: {

      },
    };

    this.init();

  }

  /**
   * Workaround for the mangling in production build to break constructor.name
   */
  static getClassName() {
    return 'AdminCustomizeContainer';
  }

  /**
   * retrieve customize data
   */
  async init() {
    // TODO GW-575 fetch data with apiV3
    try {
      await this.fetchHighLightTheme();
      // search style name from object for display
      this.setState({ currentHighlightJsStyleName: this.state.highlightJsCssSelectorOptions[this.state.currentHighlightJsStyleId].name });
    }
    catch (err) {
      logger.error(err);
      toastError(new Error('Failed to fetch data'));
    }
  }

  /**
   * Fetch highLight theme
   */
  async fetchHighLightTheme() {
    const response = await this.appContainer.apiv3.get('/customize-setting/');
    this.setState({
      highlightJsCssSelectorOptions: response.data.highlightJsCssSelectorOptions,
    });
  }

  /**
   * Switch layoutType
   */
  switchLayoutType(lauoutName) {
    this.setState({ currentLayout: lauoutName });
  }

  /**
   * Switch themeType
   */
  switchThemeType(themeName) {
    // can't choose theme when kibela
    if (this.state.currentLayout === 'kibela') {
      return;
    }
    this.setState({ currentTheme: themeName });
  }

  /**
   * Switch behaviorType
   */
  switchBehaviorType(behaviorName) {
    this.setState({ currentBehavior: behaviorName });
  }

  /**
   * Switch enabledTimeLine
   */
  switchEnableTimeline() {
    this.setState({ isEnabledTimeline:  !this.state.isEnabledTimeline });
  }

  /**
   * Switch savedStatesOfTabChanges
   */
  switchSavedStatesOfTabChanges() {
    this.setState({ isSavedStatesOfTabChanges:  !this.state.isSavedStatesOfTabChanges });
  }

  /**
   * Switch enabledAttachTitleHeader
   */
  switchEnabledAttachTitleHeader() {
    this.setState({ isEnabledAttachTitleHeader:  !this.state.isEnabledAttachTitleHeader });
  }

  /**
   * Switch recentCreatedLimit
   */
  switchRecentCreatedLimit(value) {
    this.setState({ currentRecentCreatedLimit: value });
  }

  /**
   * Switch highlightJsStyle
   */
  switchHighlightJsStyle(styleId, styleName, isBorderEnable) {
    this.setState({ currentHighlightJsStyleId: styleId });
    this.setState({ currentHighlightJsStyleName: styleName });
    // recommended settings are applied
    this.setState({ isHighlightJsStyleBorderEnabled: isBorderEnable });
  }

  /**
   * Switch highlightJsStyleBorder
   */
  switchHighlightJsStyleBorder() {
    this.setState({ isHighlightJsStyleBorderEnabled: !this.state.isHighlightJsStyleBorderEnabled });
  }

  /**
   * Change custom css
   */
  changeCustomCss(inputValue) {
    this.setState({ currentCustomizeCss: inputValue });
  }

  /**
   * Change customize script
   */
  changeCustomizeScript(inpuValue) {
    this.setState({ currentCustomizeScript: inpuValue });
  }


  /**
   * Update layout
   * @memberOf AdminCustomizeContainer
   * @return {Array} Appearance
   */
  async updateCustomizeLayoutAndTheme() {
    const response = await this.appContainer.apiv3.put('/customize-setting/layoutTheme', {
      layoutType: this.state.currentLayout,
      themeType: this.state.currentTheme,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update behavior
   * @memberOf AdminCustomizeContainer
   * @return {string} Behavior
   */
  async updateCustomizeBehavior() {
    const response = await this.appContainer.apiv3.put('/customize-setting/behavior', {
      behaviorType: this.state.currentBehavior,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update function
   * @memberOf AdminCustomizeContainer
   * @return {string} Functions
   */
  async updateCustomizeFunction() {
    const response = await this.appContainer.apiv3.put('/customize-setting/function', {
      isEnabledTimeline: this.state.isEnabledTimeline,
      isSavedStatesOfTabChanges: this.state.isSavedStatesOfTabChanges,
      isEnabledAttachTitleHeader: this.state.isEnabledAttachTitleHeader,
      recentCreatedLimit: this.state.currentRecentCreatedLimit,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }

  /**
   * Update code highlight
   * @memberOf AdminCustomizeContainer
   * @return {Array} Code highlight
   */
  async updateHighlightJsStyle() {
    const response = await this.appContainer.apiv3.put('/customize-setting/highlight', {
      highlightJsStyle: this.state.currentHighlightJsStyleId,
      highlightJsStyleBorder: this.state.isHighlightJsStyleBorderEnabled,
    });
    const { customizedParams } = response.data;
    return customizedParams;
  }


  /**
   * Update customCss
   * @memberOf AdminCustomizeContainer
   * @return {string} Customize css
   */
  async updateCustomizeCss() {
    // TODO GW-534 create apiV3
  }

  /**
   * Update customize script
   * @memberOf AdminCustomizeContainer
   * @return {string} Customize scripts
   */
  async updateCustomizeScript() {
    // TODO GW-538 create apiV3
  }


}
