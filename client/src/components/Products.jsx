// Products.jsx
import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Products = ({ products }) => {
  // Destructure products from props
  return (
    <div>
      <h1>Products</h1>
      {products.map((product) => (
        <div key={product.id}>
          <h2>{product.name}</h2>
          <p>{product.description}</p>
          <Link to={`/products/${product.id}`}>View Details</Link>
        </div>
      ))}
    </div>
  );
};

Products.propTypes = {
  products: PropTypes.shape({
    map: PropTypes.func,
  }),
};

export default Products;
