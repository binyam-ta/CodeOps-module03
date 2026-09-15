import PropTypes from "prop-types";

function Card({ children, className = "" }) {
  return (
    <div className={`card ${className}`.trim()}>
      {children}
    </div>
  );
}

Card.propTypes = {
  children: PropTypes.node.isRequired,
  className: PropTypes.string,
};

export default Card;
