import { useRef, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'motion/react';
import './TiltedCard.css';

const springValues = { damping: 30, stiffness: 100, mass: 2 };

export default function TiltedCard({
  imageSrc, altText = '音乐专辑封面', captionText = '', containerHeight = '100%', containerWidth = '100%',
  imageHeight = '100%', imageWidth = '100%', scaleOnHover = 1.08, rotateAmplitude = 12,
  showTooltip = true, showMobileWarning = false
}) {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useSpring(useMotionValue(0), springValues);
  const rotateY = useSpring(useMotionValue(0), springValues);
  const scale = useSpring(1, springValues);
  const opacity = useSpring(0);
  const rotateCaption = useSpring(0, { stiffness: 350, damping: 30, mass: 1 });
  const [lastY, setLastY] = useState(0);

  function handleMouse(event) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    rotateX.set((offsetY / (rect.height / 2)) * -rotateAmplitude);
    rotateY.set((offsetX / (rect.width / 2)) * rotateAmplitude);
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
    rotateCaption.set(-(offsetY - lastY) * 0.6);
    setLastY(offsetY);
  }

  return (
    <figure ref={ref} className="tilted-card-figure" style={{ height: containerHeight, width: containerWidth }}
      onMouseMove={handleMouse} onMouseEnter={() => { scale.set(scaleOnHover); opacity.set(1); }}
      onMouseLeave={() => { opacity.set(0); scale.set(1); rotateX.set(0); rotateY.set(0); rotateCaption.set(0); }}>
      {showMobileWarning && <div className="tilted-card-mobile-alert">This effect is not optimized for mobile. Check on desktop.</div>}
      <motion.div className="tilted-card-inner" style={{ width: imageWidth, height: imageHeight, rotateX, rotateY, scale }}>
        <motion.img src={imageSrc} alt={altText} className="tilted-card-img" style={{ width: imageWidth, height: imageHeight }} />
      </motion.div>
      {showTooltip && <motion.figcaption className="tilted-card-caption" style={{ x, y, opacity, rotate: rotateCaption }}>{captionText}</motion.figcaption>}
    </figure>
  );
}
