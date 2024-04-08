import React from 'react';
import { MarkerWrapper, TextMarker } from './NodeTypeRenderer';
import Hyperlink from './Hyperlink';
import BlockQuote from './BlockQuote';

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

const Content = ({
  nestedContent: { children, nodeType, data, value, content, marks },
}) => {
  const isHyperlink = nodeType === 'hyperlink';
  const isBlockQuote = nodeType === 'blockquote';

  if (isHyperlink) {
    return <Hyperlink data={data} content={content} />;
  }

  if (isBlockQuote) {
    return <BlockQuote content={content} />;
  }

  if (value) {
    return <MarkerWrapper value={value} marks={marks} />;
  }

  return <MarkerChecks content={content}>{children}</MarkerChecks>;
};

export default Content;
