import ElasticSliderOfficial from './react-bits/ElasticSlider.official';
import { RiVolumeDownFill, RiVolumeUpFill } from 'react-icons/ri';
import './react-bits/ElasticSlider.css';

export default function ElasticSlider({
  defaultValue = 0,
  className = '',
  showIcons = false,
  showValue = true,
  interactive = true,
  hoverScale = 1.2,
  onChange
}) {
  return (
    <ElasticSliderOfficial
      defaultValue={defaultValue}
      startingValue={0}
      maxValue={100}
      className={`player-elastic-slider ${className}`}
      onChange={onChange}
      showValue={showValue}
      interactive={interactive}
      hoverScale={hoverScale}
      leftIcon={showIcons ? <RiVolumeDownFill /> : null}
      rightIcon={showIcons ? <RiVolumeUpFill /> : null}
    />
  );
}
