import { Container } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import { useState, useEffect } from "react";
import { getAllProducts } from "../services/api";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "./styles/nuestrosProductos.css";
import { Link } from "react-router-dom";

function NuestrosProductos() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Carousel settings
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 5,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1200,
        settings: {
          slidesToShow: 4,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const productsData = await getAllProducts();
        setProducts(productsData);
      } catch (err) {
        console.error("Error fetching products:", err);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <Container>
        <div className="NuestrosProductos-container">
          <div className="mb-4">
            <h1 className="h2 fw-bold text-left">Nuestros Productos</h1>
          </div>
          <div className="text-center">Cargando productos...</div>
        </div>
      </Container>
    );
  }

  return (
    <Container>
      <div className="NuestrosProductos-container">
        <div className="mb-4">
          <h1 className="h2 fw-bold text-left">Nuestros Productos</h1>
        </div>

        {products.length > 0 ? (
          <Slider {...carouselSettings}>
            {products.map((product) => (
              <div key={product._id} className="px-2">
                <Link
                  to={`/producto/${product._id}`}
                  className="text-decoration-none"
                >
                  <Card className="NuestrosProductos-card wide-card h-100">
                    {/* Larger image container */}
                    <div className="NuestrosProductos-image-container">
                      <Card.Img
                        variant="top"
                        src={product.image?.url || "/placeholder-image.jpg"}
                        className="NuestrosProductos-image"
                        alt={product.name}
                      />
                    </div>

                    <Card.Body className="NuestrosProductos-body wide-body d-flex flex-column">
                      <div className="product-info text-center mt-auto">
                        <h6 className="product-title mb-1">{product.name}</h6>
                      </div>
                    </Card.Body>
                  </Card>
                </Link>
              </div>
            ))}
          </Slider>
        ) : (
          <div className="text-center">No hay productos disponibles</div>
        )}
      </div>
    </Container>
  );
}

export default NuestrosProductos;
