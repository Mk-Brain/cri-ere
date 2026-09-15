import {
  CCarousel,
  CCarouselCaption,
  CCarouselItem,
  CImage,
} from "@coreui/react";
import "@coreui/coreui/dist/css/coreui.min.css";
import Cabane from "../assets/images/image-cabane.jpg";
import At1 from "../assets/images/atelier1.jpg";
import At2 from "../assets/images/at2.jpg";
export const Carousel = () => {
  return (
    <CCarousel controls indicators interval={3000} className="mb-5">
      <CCarouselItem className="h-50">
        <CImage
          className="d-block w-100"
          src={Cabane}
          alt="slide 1"
          style={{ height: "450px", objectFit: "cover" }}
        />
        <CCarouselCaption className="d-none d-md-block">
          <h5></h5>
          <p>Une immersion unique dans la nature</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem className="h-50">
        <CImage
          className="d-block w-100"
          src={At1}
          alt="slide 2 "
          style={{ height: "450px", objectFit: "cover" }}
        />
        <CCarouselCaption className="d-none d-md-block">
          <h5></h5>
          <p>Une immersion unique dans la nature</p>
        </CCarouselCaption>
      </CCarouselItem>
      <CCarouselItem className="h-50">
        <CImage
          className="d-block w-100 "
          src={At2}
          alt="slide 3"
          style={{ height: "450px", objectFit: "cover" }}
        />
        <CCarouselCaption className="d-none d-md-block">
          <h5></h5>
          <p>Une immersion unique dans la nature</p>
        </CCarouselCaption>
      </CCarouselItem>
    </CCarousel>
  );
};
