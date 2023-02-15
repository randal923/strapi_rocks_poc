'use strict';

/**
 * rock service
 */

const { createCoreService } = require('@strapi/strapi').factories;

module.exports = createCoreService('api::rock.rock');
