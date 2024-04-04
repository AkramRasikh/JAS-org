import Hyperlink from './Hyperlink';

const nodeTypeToHTMLKey = {
  'heading-1': (children) => <h1>h1: {children}</h1>,
  'heading-2': (children) => <h2>h2: {children}</h2>,
  'heading-3': (children) => <h3>h3: {children}</h3>,
  'heading-4': (children) => <h4>h4: {children}</h4>,
  'heading-5': (children) => <h5>h5: {children}</h5>,
  'heading-6': (children) => <h6>h6: {children}</h6>,
  text: (children) => <span>{children}</span>,
  paragraph: (children) => <p>para: {children}</p>,
  hyperlink: (props, rest) => <Hyperlink {...props} {...rest} />,
  hr: () => <hr style={{ backgroundColor: 'purple', padding: '5px' }} />,
  underline: (children) => <u>{children}</u>,
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
};

const italic = 'italic';
const bold = 'bold';
const underline = 'underline';

const NodeTypeRenderer = ({ nodeType, children, ...rest }) => {
  const renderFunction = nodeTypeToHTMLKey[nodeType];
  return renderFunction(children, rest);
};

const ConditionalStyleWrapper = ({ condition, style, children }) => {
  if (condition) {
    const renderFunction = nodeTypeToHTMLKey[style];
    return renderFunction(children);
  }
  return <>{children}</>;
};

export const TextMarker = ({ content, children }) => {
  if (!content) return children;

  return content.map((contentWidget, index) => {
    const marks = contentWidget.marks;
    const value = contentWidget.value;

    return <MarkerWrapper key={index} marks={marks} value={value} />;
  });
};

export const MarkerWrapper = ({ marks, value }) => {
  if (!marks?.length) return value;
  const isBold = marks.some((mark) => mark.type === bold);
  const isUnderline = marks.some((mark) => mark.type === underline);
  const isItalic = marks.some((mark) => mark.type === italic);

  return (
    <ConditionalStyleWrapper style={italic} condition={isItalic}>
      <ConditionalStyleWrapper style={bold} condition={isBold}>
        <ConditionalStyleWrapper style={underline} condition={isUnderline}>
          {value}
        </ConditionalStyleWrapper>
      </ConditionalStyleWrapper>
    </ConditionalStyleWrapper>
  );
};

export default NodeTypeRenderer;
