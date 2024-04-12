import BlockQuote from './BlockQuote';
import Hyperlink from './Hyperlink';
import OL from './OL';
import UL from './UL';

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
  blockquote: (children, props) => (
    <BlockQuote {...props}>{children}</BlockQuote>
  ),
  underline: (children) => <u>{children}</u>,
  bold: (children) => <strong>{children}</strong>,
  italic: (children) => <em>{children}</em>,
  //
  'unordered-list': (children) => <UL>{children}</UL>,
  'ordered-list': (children) => <OL>{children}</OL>,
  'list-item': (children) => <li>{children}</li>,
  // quotes
  superscript: (children) => <sup>{children}</sup>,
  subscript: (children) => (
    <sup style={{ verticalAlign: 'sub' }}>{children}</sup>
  ),
  // code -> not sure though
  code: (children) => <code>{children}</code>,
};

const italic = 'italic';
const bold = 'bold';
const underline = 'underline';
const superscript = 'superscript';
const subscript = 'subscript';
const code = 'code';

const NodeTypeRenderer = ({ nodeType, children, ...rest }) => {
  const renderFunction = nodeTypeToHTMLKey[nodeType];
  if (renderFunction) {
    return renderFunction(children, rest);
  }
  return null;
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
  const isSuperSubscript = marks.some((mark) => mark.type === superscript);
  const isSubscript = marks.some((mark) => mark.type === subscript);
  const isCode = marks.some((mark) => mark.type === code);

  return (
    <ConditionalStyleWrapper style={italic} condition={isItalic}>
      <ConditionalStyleWrapper style={bold} condition={isBold}>
        <ConditionalStyleWrapper style={underline} condition={isUnderline}>
          <ConditionalStyleWrapper style={subscript} condition={isSubscript}>
            <ConditionalStyleWrapper
              style={superscript}
              condition={isSuperSubscript}
            >
              <ConditionalStyleWrapper style={code} condition={isCode}>
                {value}
              </ConditionalStyleWrapper>
            </ConditionalStyleWrapper>
          </ConditionalStyleWrapper>
        </ConditionalStyleWrapper>
      </ConditionalStyleWrapper>
    </ConditionalStyleWrapper>
  );
};

export default NodeTypeRenderer;
