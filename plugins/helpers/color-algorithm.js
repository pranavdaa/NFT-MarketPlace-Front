export default function rgbToHsl({ r, g, b }) {
  // convert rgb values to the range of 0-1
  let h
  const s = 25
  const l = 90
  // (r /= 255), (g /= 255), (b /= 255)

  // find min and max values out of r,g,b components
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)

  if (max === r) {
    // if red is the predominent color
    h = (g - b) / (max - min)
  } else if (max === g) {
    // if green is the predominent color
    h = 2 + (b - r) / (max - min)
  } else if (max === b) {
    // if blue is the predominent color
    h = 4 + (r - g) / (max - min)
  }

  h = h * 60 // find the sector of 60 degrees to which the color belongs
  // https://www.pathofexile.com/forum/view-thread/1246208/page/45 - hsl color wheel

  if (h > 0) {
    // h is a positive angle in the color wheel
    h = Math.floor(h)
    if (!h) {
      h = 0
    }
    return { h, s, l }
  } else {
    // h is a negative angle.
    h = Math.floor(360 - h)
    if (!h) {
      h = 0
    }
    return { h, s, l }
  }
}
