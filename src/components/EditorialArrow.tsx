import arrowSvg from '@/assets/arrow.svg';

interface EditorialArrowProps {
  className?: string;
  size?: number;
}

export const EditorialArrow = ({ className = '', size = 24 }: EditorialArrowProps) => (
  <img
    src={arrowSvg}
    alt=""
    aria-hidden="true"
    className={`inline-block ${className}`}
    style={{ width: size, height: size }}
  />
);
