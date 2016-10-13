'use strict';

import globals from '../globals/globals';
import Filter from '../api-query/Filter';
import Geo from '../api-query/Geo';
import WeDeploy from '../api/WeDeploy';
import Query from '../api-query/Query';
import Range from '../api-query/Range';

globals.window.Filter = Filter;
globals.window.Geo = Geo;
globals.window.Query = Query;
globals.window.Range = Range;
globals.window.WeDeploy = WeDeploy;

export { Filter, Geo, Query, Range, WeDeploy };
export default WeDeploy;
