import React from 'react';
import { MarkerWrapper, TextMarker } from './NodeTypeRenderer';
import Hyperlink from './Hyperlink';

export const MarkerChecks = ({ content }) => {
  if (!content) return null;
  const nestedContentWidgetValue = content.value;

  if (nestedContentWidgetValue) {
    return (
      <MarkerWrapper value={nestedContentWidgetValue} marks={content.marks} />
    );
  }

  return <TextMarker content={content}>{nestedContentWidgetValue}</TextMarker>;
};

export const CheckIfNeedsHyperLink = ({
  children,
  nodeType,
  data,
  value,
  content,
  marks,
}) => {
  const isHyperlink = nodeType === 'hyperlink';

  if (isHyperlink) {
    return <Hyperlink data={data} content={content} />;
  }

  if (value) {
    return <MarkerWrapper value={value} marks={marks} />;
  }

  return <MarkerChecks content={content}>{children}</MarkerChecks>;
};

const Content = ({ nestedContent }) => {
  return <CheckIfNeedsHyperLink {...nestedContent} />;
};

export default Content;
