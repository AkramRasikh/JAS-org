import { MarkerChecks } from './Content';

const Hyperlink = ({ data, content }) => {
  const url = data.uri;

  return (
    <a href={url} target='_blank' style={{ textDecoration: 'none' }}>
      {content.map((contentItem, index) => (
        <MarkerChecks key={index} content={contentItem} />
      ))}
    </a>
  );
};

export default Hyperlink;
