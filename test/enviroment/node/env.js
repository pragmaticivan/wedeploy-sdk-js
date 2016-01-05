'use strict';

import assert from 'assert';
import NodeRequestMock from '../../fixtures/node/NodeRequestMock';

global.assert = assert;
global.RequestMock = NodeRequestMock;