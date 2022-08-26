import { Application } from './Application';
import { loadQuery } from './reducers/actions/loadQuery';

loadQuery('VFB_00101567'); //inital query load

const app = Application();
export { app };


