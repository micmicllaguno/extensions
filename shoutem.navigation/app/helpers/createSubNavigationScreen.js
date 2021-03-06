import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { Screen, isIphoneX } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { actions } from 'shoutem.application';

import {
  mapIsRootScreenToProps,
  mapExtensionSettingsToProps,
  shortcutChildrenRequired,
} from './index';

const { bool, shape, string } = PropTypes;

const isTabBarOnScreen = true;
const IPHONE_X_HOME_INDICATOR_PADDING = isTabBarOnScreen ? 0 : 34;

const resolveStyleName = (props) => {
  const {
    isRootScreen,
    navigationBarImage,
  } = props;

  if (navigationBarImage) {
    return 'clear';
  }
  return (isRootScreen) ? 'clear none' : '';
};

export default function createSubNavigationScreen(Component) {
  class FolderBaseScreen extends React.Component {
    static propTypes = {
      isRootScreen: bool,
      shortcut: shape({
        title: string,
      }),
      navigationBarImage: string,
      backgroundImageEnabledFirstScreen: bool,
      showTitle: bool,
      fitContainer: bool,
    };

    resolveNavBarProps() {
      const {
        backgroundImageEnabledFirstScreen,
        showTitle,
        fitContainer,
        isRootScreen,
      } = this.props;
      let {
        navigationBarImage,
        shortcut: { title },
      } = this.props;

      if (backgroundImageEnabledFirstScreen && !isRootScreen) {
        navigationBarImage = null;
      }

      if (navigationBarImage && !showTitle) {
        title = null;
      }

      return {
        styleName: resolveStyleName(this.props),
        title,
        navigationBarImage,
        fitContainer,
      };
    }

    resolveScreenProps() {
      const { isRootScreen } = this.props;

      const style = isIphoneX ? {
        paddingBottom: IPHONE_X_HOME_INDICATOR_PADDING,
      } : {};

      return {
        // Main Navigation Screens does not have NavigationBar, so when Folder screen is Main
        // navigation screen (and has no NavigationBar) stretch screen.
        onLayout: this.layoutChanged,
        styleName: isRootScreen ? 'full-screen' : '',
        style,
      };
    }

    render() {
      return (
        <Screen {...this.resolveScreenProps()}>
          <NavigationBar {...this.resolveNavBarProps()} />
          <Component {...this.props} />
        </Screen>
      );
    }
  }

  const mapStateToProps = (state, ownProps) => ({
    ...mapIsRootScreenToProps(state, ownProps),
    ...mapExtensionSettingsToProps(state, ownProps),
  });

  return shortcutChildrenRequired(
    connect(mapStateToProps, { executeShortcut: actions.executeShortcut })(FolderBaseScreen),
  );
}
