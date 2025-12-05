import "./Spiner.css";

const Spinner = ({ text = "Loading..." }) => {
  return (
    <div className="vstack">
      <div className="spinner"></div>
      <div className="spinner-text">{text}</div>
    </div>
  );
};

export default Spinner;
