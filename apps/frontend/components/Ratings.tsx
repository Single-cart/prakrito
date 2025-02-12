"use client";

import { useId } from "react";
import StarRatings from "react-star-ratings";

interface Props {
  numOfRating: number;
  size?: string;
  space?: string;
  ratingId?: string; // Add optional ratingId prop
}

const Ratings = ({
  numOfRating,
  size = "20px",
  space = "2px",
  ratingId,
}: Props) => {
  const uniqueId = useId();
  const stableId = ratingId || uniqueId;

  return (
    <StarRatings
      rating={numOfRating}
      starRatedColor="orange"
      starHoverColor="orange"
      starDimension={size}
      starSpacing={space}
      numberOfStars={5}
      name={`rating-${stableId}`}
    />
  );
};

export default Ratings;
