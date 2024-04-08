import Content from './Content';
import NodeTypeRenderer from './NodeTypeRenderer';

const OL = ({ children }) => (
  <ol>
    {children.map((nestedChild, index) => {
      const nestedListItem = nestedChild.props.nestedContent;
      return (
        <NodeTypeRenderer key={index} nodeType={nestedListItem.nodeType}>
          {nestedListItem.content.map((contentNested) => {
            return contentNested.content.map((contentAgain, thirdIndex) => {
              return <Content key={thirdIndex} nestedContent={contentAgain} />;
            });
          })}
        </NodeTypeRenderer>
      );
    })}
  </ol>
);

export default OL;
