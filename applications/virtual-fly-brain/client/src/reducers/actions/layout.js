import { getLayoutTypes } from './types/getLayoutTypes';

export const showComponent = (componentID, config) => ({
  type: getLayoutTypes.SHOW_WIDGET,
  componentID,
  config
})