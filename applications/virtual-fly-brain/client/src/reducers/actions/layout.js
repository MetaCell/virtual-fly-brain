import { getLayoutTypes } from './types/getLayoutTypes';

export const showComponent = (componentID, config) => ({
  type: getLayoutTypes.SHOW_WIDGET,
  componentID,
  config
})

export const loadCustomLayout = (layout) => ({
  type: getLayoutTypes.LOAD_CUSTOM_LAYOUT,
  data: layout
});

export const saveCustomLayout = () => ({
  type: getLayoutTypes.AUTOSAVE_LAYOUT,
  data: undefined
});
