import Carousel from "react-bootstrap/Carousel";

function Carrusel() {
  return (
    <Carousel>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner1.jpg" // This looks in public/images/
          alt="First slide"
          style={{ height: "500px", objectFit: "contain" }}
        />
        <Carousel.Caption>
          <h3>Primer Banner</h3>
          <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner2.png" // This looks in public/images/
          alt="Second slide"
          style={{ height: "500px", objectFit: "contain" }}
        />
        <Carousel.Caption>
          <h3>Segundo Banner</h3>
          <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
        </Carousel.Caption>
      </Carousel.Item>
      <Carousel.Item>
        <img
          className="d-block w-100"
          src="/images/banner3.jpg" // This looks in public/images/
          alt="Third slide"
          style={{ height: "500px", objectFit: "contain" }}
        />
        <Carousel.Caption>
          <h3>Tercer Banner</h3>
          <p>
            Praesent commodo cursus magna, vel scelerisque nisl consectetur.
          </p>
        </Carousel.Caption>
      </Carousel.Item>
    </Carousel>
  );
}

export default Carrusel;
