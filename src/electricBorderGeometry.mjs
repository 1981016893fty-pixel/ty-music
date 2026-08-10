export function roundedRectPerimeter(width, height, radius) {
  return 2 * (width - 2 * radius) + 2 * (height - 2 * radius) + 2 * Math.PI * radius;
}

function cornerPoint(centerX, centerY, radius, startAngle, arcLength, progress) {
  const angle = startAngle + progress * arcLength;
  return {
    x: centerX + radius * Math.cos(angle),
    y: centerY + radius * Math.sin(angle)
  };
}

export function roundedRectPoint(t, left, top, width, height, radius) {
  const straightWidth = width - 2 * radius;
  const straightHeight = height - 2 * radius;
  const cornerArc = (Math.PI * radius) / 2;
  const distance = Math.max(0, Math.min(1, t)) * roundedRectPerimeter(width, height, radius);
  let accumulated = 0;

  if (distance <= accumulated + straightWidth) {
    return { x: left + radius + distance - accumulated, y: top };
  }
  accumulated += straightWidth;

  if (distance <= accumulated + cornerArc) {
    return cornerPoint(left + width - radius, top + radius, radius, -Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
  }
  accumulated += cornerArc;

  if (distance <= accumulated + straightHeight) {
    return { x: left + width, y: top + radius + distance - accumulated };
  }
  accumulated += straightHeight;

  if (distance <= accumulated + cornerArc) {
    return cornerPoint(left + width - radius, top + height - radius, radius, 0, Math.PI / 2, (distance - accumulated) / cornerArc);
  }
  accumulated += cornerArc;

  if (distance <= accumulated + straightWidth) {
    return { x: left + width - radius - (distance - accumulated), y: top + height };
  }
  accumulated += straightWidth;

  if (distance <= accumulated + cornerArc) {
    return cornerPoint(left + radius, top + height - radius, radius, Math.PI / 2, Math.PI / 2, (distance - accumulated) / cornerArc);
  }
  accumulated += cornerArc;

  if (distance <= accumulated + straightHeight) {
    return { x: left, y: top + height - radius - (distance - accumulated) };
  }
  accumulated += straightHeight;

  return cornerPoint(left + radius, top + radius, radius, Math.PI, Math.PI / 2, (distance - accumulated) / cornerArc);
}
