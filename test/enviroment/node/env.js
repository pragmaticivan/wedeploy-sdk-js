'use strict';

import assert from 'assert';
import NodeRequestMock from '../../fixtures/node/NodeRequestMock';
import '../../../src/env/node';

global.assert = assert;
global.RequestMock = NodeRequestMock;
