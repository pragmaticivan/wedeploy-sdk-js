'use strict';

import { core } from 'metal';
import globals from '../globals/globals';

function assertBrowserEnvironment() {
	if (!globals.window) {
		throw new Error('Sign-in type not supported in this environment');
	}
}

function assertDefAndNotNull(value, errorMessage) {
	if (!core.isDefAndNotNull(value)) {
		throw new Error(errorMessage);
	}
}

function assertFunction(value, errorMessage) {
	if (!core.isFunction(value)) {
		throw new Error(errorMessage);
	}
}

function assertObject(value, errorMessage) {
	if (!core.isObject(value)) {
		throw new Error(errorMessage);
	}
}

function assertResponseSucceeded(response) {
	if (!response.succeeded()) {
		throw response.body();
	}
	return response;
}

function assertUserSignedIn(user) {
	if (!core.isDefAndNotNull(user)) {
		throw new Error('You must be signed-in to perform this operation');
	}
}

export { assertBrowserEnvironment, assertDefAndNotNull, assertFunction, assertObject, assertResponseSucceeded, assertUserSignedIn };
