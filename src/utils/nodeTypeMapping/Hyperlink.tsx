import NodeTypeRenderer from './NodeTypeRenderer';

const Hyperlink = ({ data, content }) => {
  const url = data.uri;

  return (
    <a href={url} target='_blank'>
      {content.map((contentItem, index) => (
        <NodeTypeRenderer nodeType={contentItem.nodeType} key={index}>
          {contentItem.value}
        </NodeTypeRenderer>
      ))}
    </a>
  );
};

export default Hyperlink;
