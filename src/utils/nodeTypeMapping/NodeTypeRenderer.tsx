import Hyperlink from './Hyperlink';

const nodeTypeToHTMLKey = {
  'heading-1': (children) => <h1 style={{ color: 'green' }}>{children}</h1>,
  paragraph: (children) => <p style={{ color: 'red' }}>{children}</p>,
  hyperlink: (props, rest) => <Hyperlink {...props} {...rest} />,
  hr: () => <hr style={{ backgroundColor: 'purple', padding: '5px' }} />,
};

const NodeTypeRenderer = ({ nodeType, children, ...rest }) => {
  const renderFunction = nodeTypeToHTMLKey[nodeType];

  if (renderFunction) {
    return renderFunction(children, rest);
  } else {
    return <span>{children}</span>;
  }
};

export default NodeTypeRenderer;
