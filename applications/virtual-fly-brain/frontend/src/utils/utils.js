export const getTextColor = (color) => {       
    const nThreshold = 105;

    const r = color.substring(1, 3);
    const g = color.substring(3, 5);
    const b = color.substring(5, 7);

    let rgb = {
       R: parseInt(r, 16),
       G: parseInt(g, 16),
       B: parseInt(b, 16)
    };

    const bgDelta = (rgb.R * 0.299) + (rgb.G * 0.587) + (rgb.B * 0.114);

    return ((255 - bgDelta) < nThreshold) ? "#000000" : "#ffffff";   
 }

 export const getUpdatedTags = (facets_annotations_colors) => {
    let tags = {};
    Object.keys(facets_annotations_colors)?.forEach( fa => {
        tags[fa] = { ...facets_annotations_colors[fa], textColor : getTextColor(facets_annotations_colors[fa].color)};
    })

    return tags;
 }

export const formatTagText = (tag) => {
    return tag.split('_').map(part => 
        part.charAt(0).toUpperCase() + part.slice(1).toLowerCase()
    ).join(' ');
}
