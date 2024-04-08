const BlockQuote = ({ children }) => (
  <blockquote
    style={{
      margin: '0px 0px 1.3125rem',
      borderLeft: '6px solid rgb(231, 235, 238)',
      paddingLeft: '0.875rem',
    }}
  >
    {children}
  </blockquote>
);

export default BlockQuote;
