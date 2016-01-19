'use strict';

import Filter from '../../api-query/Filter';
import Geo from '../../api-query/Geo';
import Launchpad from '../../api/Launchpad';
import Query from '../../api-query/Query';
import Range from '../../api-query/Range';

Launchpad.socket(window.io);

window.Filter = Filter;
window.Geo = Geo;
window.Query = Query;
window.Range = Range;
window.Launchpad = Launchpad;
