'use strict';

import io from 'socket.io-client';
import Filter from '../api-query/Filter';
import Geo from '../api-query/Geo';
import Query from '../api-query/Query';
import WeDeploy from '../api/WeDeploy';
import NodeTransport from '../api/node/NodeTransport';
import Range from '../api-query/Range';
import TransportFactory from '../api/TransportFactory';

TransportFactory[TransportFactory.DEFAULT_TRANSPORT_NAME] = NodeTransport;
WeDeploy.socket(io);

export { WeDeploy, Filter, Geo, Query, Range };
