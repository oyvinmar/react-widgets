'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var React = require('react'),
    ReplaceTransitionGroup = require('./ReplaceTransitionGroup'),
    compat = require('./util/compat'),
    css = require('dom-helpers/style'),
    getWidth = require('dom-helpers/query/width'),
    config = require('./util/configuration');

var SlideChildGroup = React.createClass({
  displayName: 'SlideChildGroup',


  propTypes: {
    direction: React.PropTypes.oneOf(['left', 'right']),
    duration: React.PropTypes.number
  },

  componentWillEnter: function componentWillEnter(done) {
    var _this = this;

    var node = compat.findDOMNode(this),
        width = getWidth(node),
        direction = this.props.direction;

    width = direction === 'left' ? width : -width;

    this.ORGINAL_POSITION = node.style.position;

    css(node, { position: 'absolute', left: width + 'px', top: 0 });

    config.animate(node, { left: 0 }, this.props.duration, function () {

      css(node, {
        position: _this.ORGINAL_POSITION,
        overflow: 'hidden'
      });

      _this.ORGINAL_POSITION = null;
      done && done();
    });
  },

  componentWillLeave: function componentWillLeave(done) {
    var _this2 = this;

    var node = compat.findDOMNode(this),
        width = getWidth(node),
        direction = this.props.direction;

    width = direction === 'left' ? -width : width;

    this.ORGINAL_POSITION = node.style.position;

    css(node, { position: 'absolute', top: 0, left: 0 });

    config.animate(node, { left: width + 'px' }, this.props.duration, function () {
      css(node, {
        position: _this2.ORGINAL_POSITION,
        overflow: 'hidden'
      });

      _this2.ORGINAL_POSITION = null;
      done && done();
    });
  },

  render: function render() {
    return React.Children.only(this.props.children);
  }

});

module.exports = React.createClass({
  displayName: 'exports',


  propTypes: {
    direction: React.PropTypes.oneOf(['left', 'right']),
    duration: React.PropTypes.number
  },

  getDefaultProps: function getDefaultProps() {
    return {
      direction: 'left',
      duration: 250
    };
  },

  _wrapChild: function _wrapChild(child, ref) {
    return React.createElement(
      SlideChildGroup,
      { key: child.key, ref: ref,
        direction: this.props.direction,
        duration: this.props.duration },
      child
    );
  },

  render: function render() {
    var _props = this.props;
    var style = _props.style;
    var children = _props.children;

    var props = _objectWithoutProperties(_props, ['style', 'children']);

    style = _extends({}, style, { position: 'relative', overflow: 'hidden' });

    return React.createElement(
      ReplaceTransitionGroup,
      _extends({}, props, {
        ref: 'container',
        childFactory: this._wrapChild,
        style: style,
        component: 'div' }),
      children
    );
  },

  isTransitioning: function isTransitioning() {
    return this.isMounted() && this.refs.container.isTransitioning();
  }
});