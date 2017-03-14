'use strict';

import io from 'socket.io-client';
import Filter from '../api-query/Filter';
import Geo from '../api-query/Geo';
import Query from '../api-query/Query';
import WeDeploy from '../api/WeDeploy';
import NodeTransport from '../api/node/NodeTransport';
import Range from '../api-query/Range';
import TransportFactory from '../api/TransportFactory';
import FormData from 'form-data';

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = NodeTransport;
WeDeploy.socket(io);
WeDeploy.formData(FormData);
WeDeploy.Filter = Filter;
WeDeploy.Geo = Geo;
WeDeploy.Query = Query;
WeDeploy.Range = Range;

// This is for backwards compatibility for previous versions that were using
// named exports.
WeDeploy.WeDeploy = WeDeploy;

export default WeDeploy;
