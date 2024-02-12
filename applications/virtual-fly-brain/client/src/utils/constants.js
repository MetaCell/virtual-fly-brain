export const SELECTED_COLOR = { r: 0.8, g: 0.8, b: 0, a: 1 }
export const DESELECTED_COLOR = { r : .2 , g : .8, b : 1, a : 1 }
export const TEMPLATE_COLOR = { r : .8 , g : .8, b : .8, a : 1 }
export const SKELETON = "skeleton";
export const CYLINDERS = "sphere";
export const NEURON = "neuron"

export const RGBAToHexA = (color) => {
    let r =  Math.round(color?.r * 255).toString(16);
    let g =  Math.round(color?.g * 255).toString(16);
    let b =  Math.round(color?.b * 255).toString(16);
    let a = Math.round(color?.a * 255).toString(16);
  
    if (r?.length == 1)
      r = "0" + r;
    if (g?.length == 1)
      g = "0" + g;
    if (b?.length == 1)
      b = "0" + b;
    if (a?.length == 1)
      a = "0" + a;
  
    return "#" + r + g + b + a;
  }
