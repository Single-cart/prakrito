"use client";

import StarRatings from "react-star-ratings";

interface Props {
  numOfRating: number;
  size?: string;
  space?: string;
}

const Ratings = ({ numOfRating, size = "20px", space = "2px" }: Props) => {
  return (
    <StarRatings
      rating={numOfRating}
      starRatedColor="orange"
      starHoverColor="orange"
      starDimension={size}
      starSpacing={space}
      numberOfStars={5}
      name="rating"
    />
  );
};

export default Ratings;
