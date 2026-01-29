import { 
  ControlsMenu, 
  Thumbnail, 
  NameComponent, 
  TypeComponent, 
  TagsComponent 
} from './listViewerComponents';

const conf = [
  {
    id: "controls",
    title: "Controls",
    customComponent: ControlsMenu,
    source: entity => entity,
  },
  {
    id: "name",
    title: "Name",
    customComponent: NameComponent,
    source : entity => entity
  },
  {
    id: "type",
    title: "Type",
    customComponent: TypeComponent,
    source : entity => entity
  },
  {
    id: "tags",
    title: "Tags",
    customComponent: TagsComponent,
    source : entity => entity
  },
  {
    id: "image",
    title: "Thumbnail",
    customComponent: Thumbnail,
    source: entity => { 

      return entity.thumbnail;
    }
  }
];

export default conf;
