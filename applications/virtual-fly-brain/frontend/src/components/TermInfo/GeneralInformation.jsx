import { Box, Button, Chip, Grid, Typography, Tooltip } from "@mui/material";
import React, { useState } from "react";
import { useSelector } from 'react-redux';
import ReactMarkdown from 'react-markdown';
import { LinkIcon } from "../../icons";
import vars from "../../theme/variables";
import TerminfoSlider from "./TerminfoSlider";
import FullScreenViewer from "../queryBuilder/FullScreenViewer";
import { getUpdatedTags, formatTagText } from "../../utils/utils";
import { facets_annotations_colors as colors_config } from "../../components/configuration/VFBColors";
import { getInstanceByID } from "../../reducers/actions/instances";

const {
  whiteColor,
  secondaryBg,
  carouselBg,
  headerBorderColor,
  tabActiveColor,
  descriptionBg,
  searchBoxBg
} = vars;

const chips_cutoff = 2;

const facets_annotations_colors = getUpdatedTags(colors_config)

const GeneralInformation = ({ data, classes }) => {
  const [toggleReadMore, setToggleReadMore] = useState({});
  const [fullScreen, setFullScreen] = useState(false)
  const reduxState = useSelector(state => state);
  const MAX_LENGTH = 35;

  // Get current template information
  const currentTemplate = reduxState.instances.launchTemplate;
  const currentTemplateName = currentTemplate?.metadata?.Name || 'Unknown Template';
  const currentTemplateId = currentTemplate?.metadata?.Id;

  const handleTemplateClick = () => {
    if (currentTemplateId) {
      getInstanceByID(currentTemplateId, true, true, true);
    }
  };

  // Check if a string contains markdown
  const containsMarkdown = (text) => {
    if (typeof text !== 'string') return false;
    const markdownPatterns = [
      /\*\*.*\*\*/,  // bold
      /\*.*\*/,      // italic
      /\[.*\]\(.*\)/, // links
      /^#+\s/,       // headers
      /```.*```/s,   // code blocks
      /`.*`/,        // inline code
    ];
    return markdownPatterns.some(pattern => pattern.test(text));
  };

  const renderTooltipChips = (data) => {
    return (
      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
        {data?.metadata?.Tags?.slice(chips_cutoff).map((tag, i) => (
          <Chip
            key={tag + i}
            sx={{
              lineHeight: '140%',
              fontSize: '0.625rem',
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color,
              color: facets_annotations_colors[tag]?.textColor || facets_annotations_colors?.default?.textColor,
            }}
            label={formatTagText(tag)}
          />
        ))}
      </Box>
    );
  };

  // Render Tags with chips
  const renderTags = (tags) => {
    if (!Array.isArray(tags)) return null;
    return (
      <Box sx={{ display: 'flex', columnGap: '4px', flexWrap: 'wrap', justifyContent: 'end' }} gap={'0.288rem'}>
        {tags.slice(0, chips_cutoff).map((tag) => (
          <Chip 
            key={tag} 
            sx={{ 
              backgroundColor: facets_annotations_colors[tag]?.color || facets_annotations_colors?.default?.color, 
              color: '#ffffff' 
            }} 
            label={formatTagText(tag)} 
          />
        ))}
        {tags.length > chips_cutoff && (
          <Tooltip
            title={renderTooltipChips({ metadata: { Tags: tags } })}
            placement="bottom-end"
            arrow
          >
            <Chip
              sx={{
                lineHeight: '140%',
                fontSize: '0.625rem',
                backgroundColor: searchBoxBg
              }}
              label={`+${tags.length - chips_cutoff}`}
            />
          </Tooltip>
        )}
      </Box>
    );
  };

  // Render Description with read more functionality
  const renderDescription = (description, fieldKey) => {
    if (!description) return null;
    const isExpanded = toggleReadMore[fieldKey] || false;
    
    return (
      <Box display='flex' flexDirection='column' alignItems='flex-end'>
        <Typography sx={{
          ...classes.heading,
          color: whiteColor,
          borderRadius: isExpanded ? 1 : 0,
          textAlign: 'right',
          padding: isExpanded ? '0.25rem 0.5rem' : "0.10rem 0.12rem",
          background: {
            xs: isExpanded ? descriptionBg : 'transparent',
            xl: isExpanded ? secondaryBg : 'transparent',
          }
        }}
        className='scrollbar'>
          {isExpanded ? description : (description.length > MAX_LENGTH ? `${description.substr(0, MAX_LENGTH)}...` : description)}
        </Typography>
        {description.length > MAX_LENGTH && (
          <Button
            onClick={() => setToggleReadMore((prev) => ({ ...prev, [fieldKey]: !prev[fieldKey] }))} 
            disableRipple
            sx={{
              padding: 0,
              marginTop: '0.25rem',
              height: 'auto',
              color: tabActiveColor,
              '&:hover': {
                background: 'transparent'
              }
            }}>
            {isExpanded ? 'Show Less' : 'Read More'}
          </Button>
        )}
      </Box>
    );
  };

  // Render Name with ID
  const renderName = (name, id) => {
    const handleNameClick = () => {
      if (id) {
        getInstanceByID(id, true, true, true);
      }
    };

    return (
      <Box 
        onClick={handleNameClick} 
        sx={{ 
          textAlign: 'right',
          cursor: id ? 'pointer' : 'default',
          '&:hover': id ? { 
            '& .name-text': { 
              color: tabActiveColor
            }
          } : {}
        }}
      >
        <ReactMarkdown 
          components={{
            p: ({ children }) => (
              <Typography 
                className="name-text"
                sx={{
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right',
                  margin: 0,
                  transition: 'color 0.2s ease-in-out'
                }}
              >
                {children}
              </Typography>
            )
          }}
        >
          {`${name}`}
        </ReactMarkdown>
      </Box>
    );
  };

  // Render Licenses with label and icon
  const renderLicensesList = (licenses) => {
    if (!licenses || typeof licenses !== 'object') return null;
    
    const handleLabelClick = (shortForm) => {
      if (shortForm) {
        getInstanceByID(shortForm, true, true, true);
      }
    };

    const handleIconClick = (iri) => {
      if (iri) {
        window.open(iri, '_blank', 'noopener,noreferrer');
      }
    };

    return (
      <Box sx={{ textAlign: 'right' }}>
        {Object.values(licenses).map((license, index) => {
          if (!license || typeof license !== 'object') return null;
          
          return (
            <Box key={index} sx={{ 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'flex-end', 
              gap: '0.5rem',
              marginBottom: index < Object.values(licenses).length - 1 ? '0.5rem' : 0
            }}>
              {/* License Label */}
              <Typography 
                sx={{
                  ...classes.heading,
                  color: whiteColor,
                  textAlign: 'right',
                  cursor: license.short_form ? 'pointer' : 'default',
                  transition: 'color 0.2s ease-in-out',
                  '&:hover': license.short_form ? {
                    color: tabActiveColor
                  } : {}
                }}
                onClick={() => handleLabelClick(license.short_form)}
              >
                {license.label}
              </Typography>
              
              {/* License Icon */}
              {license.icon && (
                <Box
                  component="img"
                  src={license.icon}
                  alt={license.label}
                  sx={{
                    height: '1em',
                    width: 'auto',
                    cursor: 'pointer',
                    transition: 'opacity 0.2s ease-in-out',
                    '&:hover': {
                      opacity: 0.8
                    }
                  }}
                  onClick={() => handleIconClick(license.iri)}
                />
              )}
            </Box>
          );
        })}
      </Box>
    );
  };

  // Render "Aligned To" chip
  const renderAlignedTo = () => {
    return currentTemplateId ? (
      <Chip 
        icon={<LinkIcon />} 
        label={currentTemplateName} 
        onClick={handleTemplateClick}
        sx={{ 
          cursor: 'pointer',
          transition: 'background-color 0.2s ease-in-out',
          '&:hover': {
            backgroundColor: tabActiveColor
          }
        }}
      />
    ) : (
      <Chip 
        label={currentTemplateName} 
        sx={{ cursor: 'default' }}
      />
    );
  };

  // Render Relationships with hierarchy and clickable terms
  const renderRelationships = (relationships) => {
    if (!relationships || typeof relationships !== 'string') return null;
    
    // Parse relationship structure like "[develops from](RO_0002202): [medulla anlage](FBbt_00001935)"
    const parseRelationshipItem = (item) => {
      const trimmedItem = item.trim();
      if (!trimmedItem) return null;
      
      // Check if item contains colon for hierarchy
      if (trimmedItem.includes(':')) {
        const [relationshipPart, targetPart] = trimmedItem.split(':').map(part => part.trim());
        
        // Parse relationship part - format: [text](id)
        const relationshipMatch = relationshipPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const relationshipText = relationshipMatch ? relationshipMatch[1] : relationshipPart;
        const relationshipId = relationshipMatch ? relationshipMatch[2] : null;
        
        // Parse target part - format: [text](id)
        const targetMatch = targetPart.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const targetText = targetMatch ? targetMatch[1] : targetPart;
        const targetId = targetMatch ? targetMatch[2] : null;
        
        return {
          type: 'hierarchy',
          relationship: { text: relationshipText, id: relationshipId },
          target: { text: targetText, id: targetId }
        };
      } else {
        // Single item - format: [text](id) or plain text
        const match = trimmedItem.match(/\[([^\]]+)\]\(([^)]+)\)/);
        const text = match ? match[1] : trimmedItem;
        const id = match ? match[2] : null;
        
        return {
          type: 'single',
          text,
          id
        };
      }
    };

    const handleTermClick = (id) => {
      if (id) {
        getInstanceByID(id, true, true, true);
      }
    };

    // Split by semicolon to get root level items
    const rootItems = relationships.split(';').filter(item => item.trim());
    
    return (
      <Box sx={{ textAlign: 'right' }}>
        {rootItems.map((item, index) => {
          const parsedItem = parseRelationshipItem(item);
          if (!parsedItem) return null;
          
          if (parsedItem.type === 'hierarchy') {
            return (
              <Box key={index} sx={{ 
                marginBottom: index < rootItems.length - 1 ? '1rem' : 0,
                borderBottom: index < rootItems.length - 1 ? `1px solid ${headerBorderColor}` : 'none',
                paddingBottom: index < rootItems.length - 1 ? '0.75rem' : 0
              }}>
                {/* Relationship property with semicolon */}
                <Typography 
                  sx={{
                    ...classes.heading,
                    color: whiteColor,
                    textAlign: 'right',
                    fontWeight: 'bold',
                    cursor: parsedItem.relationship.id ? 'pointer' : 'default',
                    transition: 'color 0.2s ease-in-out',
                    marginBottom: '0.5rem',
                    '&:hover': parsedItem.relationship.id ? {
                      color: tabActiveColor
                    } : {}
                  }}
                  onClick={() => handleTermClick(parsedItem.relationship.id)}
                >
                  {parsedItem.relationship.text};
                </Typography>
                {/* Target (nested on new line) */}
                <Typography 
                  sx={{
                    ...classes.heading,
                    color: whiteColor,
                    textAlign: 'right',
                    marginLeft: '1rem',
                    cursor: parsedItem.target.id ? 'pointer' : 'default',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': parsedItem.target.id ? {
                      color: tabActiveColor
                    } : {}
                  }}
                  onClick={() => handleTermClick(parsedItem.target.id)}
                >
                  {parsedItem.target.text}
                </Typography>
              </Box>
            );
          } else {
            // Single item
            return (
              <Box key={index} sx={{ 
                marginBottom: index < rootItems.length - 1 ? '1rem' : 0,
                borderBottom: index < rootItems.length - 1 ? `1px solid ${headerBorderColor}` : 'none',
                paddingBottom: index < rootItems.length - 1 ? '0.75rem' : 0
              }}>
                <Typography 
                  sx={{
                    ...classes.heading,
                    color: whiteColor,
                    textAlign: 'right',
                    cursor: parsedItem.id ? 'pointer' : 'default',
                    transition: 'color 0.2s ease-in-out',
                    '&:hover': parsedItem.id ? {
                      color: tabActiveColor
                    } : {}
                  }}
                  onClick={() => handleTermClick(parsedItem.id)}
                >
                  {parsedItem.text}
                </Typography>
              </Box>
            );
          }
        })}
      </Box>
    );
  };

  // Render Cross References with text as markdown and images in tooltips
  const renderCrossReferences = (crossReferences) => {
    if (!crossReferences) return null;
    
    // Extract images from markdown for tooltip
    const extractImageUrls = (text) => {
      const imageRegex = /!\[([^\]]*)\]\(([^)]+)\)/g;
      const images = [];
      let match;
      while ((match = imageRegex.exec(text)) !== null) {
        images.push({
          alt: match[1],
          src: match[2]
        });
      }
      return images;
    };

    // Remove images from text, keeping only the text content
    const getTextOnlyContent = (text) => {
      return text.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '').trim();
    };

    const images = typeof crossReferences === 'string' ? extractImageUrls(crossReferences) : [];
    const textContent = typeof crossReferences === 'string' ? getTextOnlyContent(crossReferences) : String(crossReferences);
    
    // Split by semicolon and render each part on a new line
    const crossRefItems = textContent.split(';').filter(item => item.trim());
    
    const content = (
      <Box sx={{ textAlign: 'right' }}>
        {crossRefItems.length > 0 ? (
          crossRefItems.map((item, index) => (
            <Box key={index} sx={{ 
              marginBottom: index < crossRefItems.length - 1 ? '0.5rem' : 0 
            }}>
              <ReactMarkdown 
                components={{
                  a: ({ href, children }) => (
                    <a 
                      href={href} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      style={{ 
                        color: tabActiveColor,
                        textDecoration: 'underline' 
                      }}
                    >
                      {children}
                    </a>
                  ),
                  p: ({ children }) => (
                    <Typography sx={{
                      ...classes.heading,
                      color: whiteColor,
                      textAlign: 'right',
                      margin: 0
                    }}>
                      {children}
                    </Typography>
                  )
                }}
              >
                {item.trim()}
              </ReactMarkdown>
            </Box>
          ))
        ) : (
          <Typography sx={{
            ...classes.heading,
            color: whiteColor,
            textAlign: 'right'
          }}>
            {typeof crossReferences === 'string' ? 'Cross Reference' : String(crossReferences)}
          </Typography>
        )}
      </Box>
    );

    // If there are images, wrap in tooltip
    if (images.length > 0) {
      return (
        <Tooltip
          title={
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {images.map((img, index) => (
                <img
                  key={index}
                  src={img.src}
                  alt={img.alt}
                  style={{
                    maxWidth: '200px',
                    maxHeight: '200px',
                    width: 'auto',
                    height: 'auto',
                    objectFit: 'contain'
                  }}
                />
              ))}
            </Box>
          }
          placement="left"
          arrow
        >
          <Box sx={{ cursor: 'help' }}>
            {content}
          </Box>
        </Tooltip>
      );
    }

    return content;
  };

  // Generic property renderer
  const renderProperty = (key, value) => {
    // Skip special properties that we handle separately or don't want to display
    const skipProperties = ['Images', 'Examples'];
    if (skipProperties.includes(key)) return null;

    // Skip boolean properties
    if (typeof value === 'boolean') return null;

    // Skip object properties (but allow arrays) - except for Meta and Licenses which we handle specially
    if (typeof value === 'object' && value !== null && !Array.isArray(value) && key !== 'Meta' && key !== 'Licenses') return null;

    // Handle special cases
    switch (key) {
      case 'Name':
        return renderName(value, data?.metadata?.Id);
      case 'Tags':
      case 'SuperTypes':
      case 'Types':
        return renderTags(value);
      case 'Licenses':
        return renderLicensesList(value);
      case 'Relationships':
        return renderRelationships(value);
      case 'Cross References':
        return renderCrossReferences(value);
      default:
        // Handle different value types
        if (Array.isArray(value)) {
          return (
            <Typography sx={{
              ...classes.heading,
              color: whiteColor,
              textAlign: 'right'
            }}>
              {value.join(', ')}
            </Typography>
          );
        } else if (typeof value === 'string') {
          if (containsMarkdown(value)) {
            return (
              <Box sx={{ textAlign: 'right' }}>
                <ReactMarkdown>{value}</ReactMarkdown>
              </Box>
            );
          } else {
            return (
              <Typography sx={{
                ...classes.heading,
                color: whiteColor,
                textAlign: 'right'
              }}>
                {value}
              </Typography>
            );
          }
        } else {
          return (
            <Typography sx={{
              ...classes.heading,
              color: whiteColor,
              textAlign: 'right'
            }}>
              {String(value)}
            </Typography>
          );
        }
    }
  };

  // Get all metadata properties to render
  const getMetadataProperties = () => {
    if (!data?.metadata) return [];
    
    const properties = [];
    const seenKeys = new Set(); // Track seen property names to avoid duplicates
    
    // Add standard properties in specific order: Name, Tags, Description only
    const standardOrder = ['Name', 'Tags'];
    standardOrder.forEach(key => {
      if (data.metadata[key] !== undefined) {
        properties.push({ key, value: data.metadata[key] });
        seenKeys.add(key);
      }
    });
    
    // Add Description from Meta if it exists (special handling for Description)
    if (data.metadata.Meta?.Description && data.metadata.Meta.Description.trim()) {
      properties.push({ key: 'Description', value: data.metadata.Meta.Description });
      seenKeys.add('Description');
    }
    
    // Add other properties from main metadata (excluding already handled ones)
    const skipKeys = ['Meta', 'Licenses', 'Images', 'Examples', 'Id', 'Queries'];
    Object.entries(data.metadata).forEach(([key, value]) => {
      if (!skipKeys.includes(key) && 
          !seenKeys.has(key) &&
          value !== undefined && 
          value !== null &&
          typeof value !== 'boolean' &&
          !(typeof value === 'object' && !Array.isArray(value))) {
        properties.push({ key, value });
        seenKeys.add(key);
      }
    });
    
    // Add all Meta properties (excluding duplicates and already handled ones)
    if (data.metadata.Meta && typeof data.metadata.Meta === 'object') {
      Object.entries(data.metadata.Meta).forEach(([key, value]) => {
        if (!seenKeys.has(key) &&
            value !== undefined && 
            value !== null &&
            typeof value !== 'boolean' &&
            !(typeof value === 'object' && !Array.isArray(value))) {
          // Special check for Comment - don't render if empty
          if (key === 'Comment' && (!value || !value.trim())) {
            return;
          }
          properties.push({ key, value });
          seenKeys.add(key);
        }
      });
    }
    
    // Add Licenses as a single property if they exist
    if (data.metadata.Licenses && typeof data.metadata.Licenses === 'object' && Object.keys(data.metadata.Licenses).length > 0) {
      properties.push({ key: 'Licenses', value: data.metadata.Licenses });
      seenKeys.add('Licenses');
    }
    
    // Add "Aligned To" at the end
    properties.push({ key: 'Aligned To', value: null, isAlignedTo: true });
    
    return properties;
  };

  return (
    <>
      <Grid container columnSpacing={2}>
        <Grid item xs={12} sm={4} md={5} lg={5}>
          <Box
            sx={{
              width: '15rem',
              background: {
                xs: carouselBg,
                lg: headerBorderColor
              },
              borderRadius: '0.5rem',
              overflow: 'hidden'
            }}
          >
            <TerminfoSlider
              allowFullscreen
              setFullScreen={setFullScreen}
              examples={data?.metadata?.Images ? data?.metadata?.Images : data?.metadata?.Examples}
            />
          </Box>
        </Grid>
        <Grid sx={{
          mt: {
            xs: 2,
            sm: 0,
          }
        }} item xs={12} sm={8} md={7} lg={7}>
          <Box display='flex' flexDirection='column' sx={{ rowGap: { xs: 1.25, sm: 1, lg: 1.25 }, width: '15rem' }}>
            {getMetadataProperties().map(({ key, value, isStatic, isAlignedTo }) => {
              // Handle special cases
              if (key === 'Description' || key === 'Comment') {
                // Don't render if value is empty
                if (!value || !value.trim()) return null;
                
                return (
                  <Box key={key} display='flex' justifyContent='space-between' columnGap={1}>
                    <Typography sx={classes.heading}>{key}</Typography>
                    {renderDescription(value, key)}
                  </Box>
                );
              }
              
              if (key === 'Relationships') {
                return (
                  <Box key={key} display='flex' justifyContent='space-between' columnGap={1}>
                    <Typography sx={classes.heading}>{key}</Typography>
                    {renderRelationships(value)}
                  </Box>
                );
              }
              
              if (isAlignedTo) {
                return (
                  <Box key={key} display='flex' justifyContent='space-between' columnGap={1}>
                    <Typography sx={classes.heading}>{key}</Typography>
                    {renderAlignedTo()}
                  </Box>
                );
              }
              
              if (isStatic && key === 'Source') {
                return (
                  <Box key={key} display='flex' justifyContent='space-between' columnGap={1}>
                    <Typography sx={classes.heading}>{key}</Typography>
                    <Chip icon={<LinkIcon />} label={value} />
                  </Box>
                );
              }
              
              // Standard property rendering
              const renderedValue = renderProperty(key, value);
              if (!renderedValue) return null;
              
              return (
                <Box key={key} display='flex' justifyContent='space-between' columnGap={key === 'Name' ? '0.188rem' : 1}>
                  <Typography sx={classes.heading}>{key}</Typography>
                  {renderedValue}
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Grid>

      {/* Full-width area below both columns */}
      <Box sx={{ width: '100%', mt: 2 }}>
        {/* Place any full-width content here, e.g. additional info, charts, etc. */}
      </Box>

      {fullScreen && (
        <FullScreenViewer open={fullScreen} onClose={() => setFullScreen(false)} images={data?.metadata?.Images ? data?.metadata?.Images : data?.metadata?.Examples} />
      )}
    </>
  )
};

export default GeneralInformation;
