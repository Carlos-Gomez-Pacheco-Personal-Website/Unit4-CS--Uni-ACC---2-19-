import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Confirmation = ({ purchasedItems }) => {
  return (
    <div>
      <h1>Confirmation</h1>
      <p>Thank you for your purchase!</p>
      <ul>
        {purchasedItems.map((item) => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
      <Link to="/">Return to Main List</Link>
    </div>
  );
};

Confirmation.propTypes = {
  purchasedItems: PropTypes.shape({
    map: PropTypes.func,
  }),
};

export default Confirmation;
