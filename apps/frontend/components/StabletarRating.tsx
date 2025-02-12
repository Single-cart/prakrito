import StarRatings from "react-star-ratings";

interface StableStarRatingProps {
  rating: number;
  onRatingChange?: (rating: number) => void;
  size?: string;
  isReadOnly?: boolean;
}

export function StableStarRating({
  rating,
  onRatingChange,
  size = "20px",
  isReadOnly = false,
}: StableStarRatingProps) {
  return (
    <StarRatings
      rating={rating}
      starRatedColor="orange"
      starHoverColor="orange"
      starDimension={size}
      starSpacing="2px"
      changeRating={isReadOnly ? undefined : onRatingChange}
      numberOfStars={5}
      name="rating"
    />
  );
}
