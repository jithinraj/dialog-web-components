/**
 * Copyright 2017 dialog LLC <info@dlg.im>
 * @flow
 */

import type { ActivitySearchItemProps as Props } from './types';
import React, { PureComponent } from 'react';
import { findDOMNode } from 'react-dom';
import { format } from 'date-fns';
import { Text } from '@dlghq/react-l10n';
import classNames from 'classnames';
import ActivitySearchItemMessage from './ActivitySearchItemMessage';
import styles from './ActivitySearchItem.css';

type State = {
  collapsed: boolean
};

class ActivitySearchItem extends PureComponent {
  props: Props;
  state: State;

  constructor(props: Props) {
    super(props);

    this.state = {
      collapsed: true
    };
  }

  handleJumpToMessage = () => {
    this.props.onGoToMessage(this.props.info.peer, this.props.focus);
  };

  handleCollapseToggle = () => {
    if (!this.hasSelection()) {
      this.setState(({ collapsed }) => {
        return {
          collapsed: !collapsed
        };
      });
    }
  };

  hasSelection(): boolean {
    const container = findDOMNode(this);
    if (container) {
      const selection = document.getSelection();
      return Boolean(selection && selection.toString());
    }

    return false;
  }

  renderHeader() {
    const { info, focus } = this.props;
    const messageDate = format(focus.fullDate, 'DD.MM.YY');

    return (
      <div className={styles.header}>
        <div className={styles.headerTitle}>{info.title}</div>
        <div className={styles.headerInfo}>
          <time dateTime={focus.fullDate.toISOString()}>{messageDate}</time>
          ・
          <Text
            id="ActivitySearch.jump"
            className={styles.headerInfoJump}
            onClick={this.handleJumpToMessage}
          />
        </div>
      </div>
    );
  }

  renderBeforeMessages() {
    const { info, before } = this.props;

    if (!before.length) {
      return null;
    }

    if (this.state.collapsed) {
      return (
        <ActivitySearchItemMessage
          info={info}
          message={before[before.length - 1]}
          highlited={false}
          short
          collapsed
        />
      );
    }

    return before.map((message) => {
      return (
        <ActivitySearchItemMessage
          key={message.rid}
          info={info}
          message={message}
          highlited={false}
          short={false}
          collapsed={false}
          onGoToPeer={this.props.onGoToPeer}
        />
      );
    });
  }

  renderFocusMessage() {
    const { info, focus } = this.props;

    return (
      <ActivitySearchItemMessage
        info={info}
        message={focus}
        highlited
        short={this.state.collapsed}
        collapsed={this.state.collapsed}
        onGoToPeer={this.props.onGoToPeer}
      />
    );
  }

  renderAfterMessages() {
    const { info, after } = this.props;

    if (!after.length) {
      return null;
    }

    if (this.state.collapsed) {
      return (
        <ActivitySearchItemMessage
          info={info}
          message={after[0]}
          highlited={false}
          short
          collapsed
        />
      );
    }

    return after.map((message) => {
      return (
        <ActivitySearchItemMessage
          info={info}
          key={message.rid}
          message={message}
          highlited={false}
          short={false}
          collapsed={false}
          onGoToPeer={this.props.onGoToPeer}
        />
      );
    });
  }

  render() {
    const className = classNames(styles.container, this.props.className);
    const messagesClassName = classNames(this.state.collapsed ? styles.messagesCollapsed : styles.messages);

    return (
      <div className={className}>
        {this.renderHeader()}
        <div className={messagesClassName} onClick={this.handleCollapseToggle}>
          {this.renderBeforeMessages()}
          {this.renderFocusMessage()}
          {this.renderAfterMessages()}
        </div>
      </div>
    );
  }
}

export default ActivitySearchItem;