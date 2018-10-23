/*
 *
 * HORTONWORKS DATAPLANE SERVICE AND ITS CONSTITUENT SERVICES
 *
 * (c) 2016-2018 Hortonworks, Inc. All rights reserved.
 *
 * This code is provided to you pursuant to your written agreement with Hortonworks, which may be the terms of the
 * Affero General Public License version 3 (AGPLv3), or pursuant to a written agreement with a third party authorized
 * to distribute this code.  If you do not have a written agreement with Hortonworks or with an authorized and
 * properly licensed third party, you do not have any rights to this code.
 *
 * If this code is provided to you under the terms of the AGPLv3:
 * (A) HORTONWORKS PROVIDES THIS CODE TO YOU WITHOUT WARRANTIES OF ANY KIND;
 * (B) HORTONWORKS DISCLAIMS ANY AND ALL EXPRESS AND IMPLIED WARRANTIES WITH RESPECT TO THIS CODE, INCLUDING BUT NOT
 *   LIMITED TO IMPLIED WARRANTIES OF TITLE, NON-INFRINGEMENT, MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE;
 * (C) HORTONWORKS IS NOT LIABLE TO YOU, AND WILL NOT DEFEND, INDEMNIFY, OR HOLD YOU HARMLESS FOR ANY CLAIMS ARISING
 *   FROM OR RELATED TO THE CODE; AND
 * (D) WITH RESPECT TO YOUR EXERCISE OF ANY RIGHTS GRANTED TO YOU FOR THE CODE, HORTONWORKS IS NOT LIABLE FOR ANY
 *   DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, PUNITIVE OR CONSEQUENTIAL DAMAGES INCLUDING, BUT NOT LIMITED TO,
 *   DAMAGES RELATED TO LOST REVENUE, LOST PROFITS, LOSS OF INCOME, LOSS OF BUSINESS ADVANTAGE OR UNAVAILABILITY,
 *   OR LOSS OR CORRUPTION OF DATA.
 *
 */

import Ember from 'ember';

import { moduleFor, test } from 'ember-qunit';

moduleFor('route:abstract', 'Unit | Route | abstract', {
  // Specify the other units that are required for this test.
  // needs: ['controller:foo']
});

test('Basic creation test', function(assert) {
  let route = this.subject();

  assert.ok(route);

  assert.ok(route.loaderQueryParams);
  assert.ok(route.model);
  assert.ok(route.queryFromParams);

  assert.ok(route.setDocTitle);
  assert.ok(route.setupController);

  assert.ok(route.checkAndCall);

  assert.ok(route.setLoading);
  assert.ok(route.loadData);
  assert.ok(route.beforeLoad);
  assert.ok(route.load);
  assert.ok(route.afterLoad);
  assert.ok(route.setValue);

  assert.ok(route.getLoadTime);
  assert.ok(route._setControllerModel);
  assert.ok(route.setLoader);

  assert.ok(route.actions.setBreadcrumbs);
  assert.ok(route.actions.bubbleBreadcrumbs);
});

test('queryFromParams test', function(assert) {
  let route = this.subject({
    loaderQueryParams: {
      id: "a_id",
      b: "b"
    }
  }),
  testParam = {
    a: 1,
    a_id: 2,
    b: 3,
    b_id: 4
  };

  assert.deepEqual(route.queryFromParams(testParam), {
    id: 2,
    b: 3
  });
});

test('checkAndCall test', function(assert) {
  let route = this.subject(),
      testValue = {},
      testQuery = {},
      testOptions = {};

  assert.expect(3 + 1);

  route.testFunction = function (value, query, options) {
    assert.equal(value, testValue, "Value check for id 1");
    assert.equal(query, testQuery, "Query check for id 1");
    assert.equal(options, testOptions, "Options check for id 1");
  };
  route.currentPromiseId = 1;

  route.checkAndCall(1, "testFunction", testQuery, testOptions, testValue);
  assert.throws(function () {
    route.checkAndCall(2, "testFunction", testQuery, testOptions, testValue);
  });
});

test('loadData test - Hook sequence check', function(assert) {
  let route = this.subject();

  // Bind poilyfill
  Function.prototype.bind = function (context, val1, val2, val3, val4) {
    var that = this;
    return function (val) {
      return that.call(context, val1, val2, val3, val4, val);
    };
  };

  assert.expect(4 + 1);

  route.setLoading = function () {
    return 1;
  };
  route.beforeLoad = function (value) {
    assert.equal(value, 1, "beforeLoad");
    return ++value;
  };
  route.load = function (value) {
    assert.equal(value, 2, "load");
    return ++value;
  };
  route.afterLoad = function (value) {
    assert.equal(value, 3, "afterLoad");
    return ++value;
  };
  route.setValue = function (value) {
    assert.equal(value, 4, "setValue");
    return ++value;
  };

  route.loadData().then(function (value) {
    assert.equal(value, 5, "Value returned by loadData");
  });

});

test('loadData test - ID change check with exception throw', function(assert) {
  let route = this.subject();

  // Bind poilyfill
  Function.prototype.bind = function (context, val1, val2, val3, val4) {
    var that = this;
    return function (val) {
      return that.call(context, val1, val2, val3, val4, val);
    };
  };

  assert.expect(2 + 1);

  route.setLoading = function () {
    return 1;
  };
  route.beforeLoad = function (value) {
    assert.equal(value, 1, "beforeLoad");
    return ++value;
  };
  route.load = function (value) {
    assert.equal(value, 2, "load");

    route.currentPromiseId = 0;

    return ++value;
  };
  route.afterLoad = function (value) {
    assert.equal(value, 3, "afterLoad");
    return ++value;
  };
  route.setValue = function (value) {
    assert.equal(value, 4, "setValue");
    return ++value;
  };

  route.loadData().then(function () {
    assert.notOk("Shouldn't be called");
  }).catch(function () {
    assert.ok(true, "Exception thrown");
  });
});

test('setLoading test', function(assert) {
  let route = this.subject();

  route.controller = Ember.Object.create();

  assert.equal(route.get("isLoading"), false);
  route.setLoading();
  assert.equal(route.get("isLoading"), true);
});

test('beforeLoad load afterLoad test', function(assert) {
  let route = this.subject(),
      testVal = {};

  assert.equal(route.beforeLoad(testVal), testVal);
  assert.equal(route.load(testVal), testVal);
  assert.equal(route.afterLoad(testVal), testVal);
});

test('setValue test', function(assert) {
  let route = this.subject(),
      testVal = {};

  route.controller = Ember.Object.create();

  route.setLoading();
  assert.equal(route.get("loadedValue"), null);
  assert.equal(route.get("isLoading"), true);
  assert.equal(route.setValue(testVal), testVal);
  assert.equal(route.get("loadedValue"), testVal);
  assert.equal(route.get("isLoading"), false);
});

test('getLoadTime test', function(assert) {
  let route = this.subject(),
      testTime = Date.now(),
      testRecord = {
        loadTime: testTime
      };

  assert.equal(route.getLoadTime(testRecord), testTime);
  assert.equal(route.getLoadTime([testRecord]), testTime);
});

test('_setControllerModel test', function(assert) {
  let route = this.subject(),
      testValue = {},
      testController = Ember.Object.create();

  route.set("loadedValue", testValue);
  route.set("controller", testController);

  assert.notOk(testController.model);
  route._setControllerModel();
  assert.equal(testController.model, testValue, "With controller");
});

test('setLoader test', function(assert) {
  let route = this.subject(),
      testNamespace = "tn",
      oldLoader = route.get("loader");

  route.setLoader(testNamespace);

  assert.notEqual(route.get("loader"), oldLoader);
  assert.equal(route.get("loader.nameSpace"), testNamespace);
  assert.equal(route.get("loader.store"), route.get("store"));
  assert.equal(route.get("loader.container"), route.get("container"));
});

test('actions.setBreadcrumbs test', function(assert) {
  let testName = "ts",
      route = this.subject({
        name: testName
      }),
      testCrumbs = {};

  // Because all controllers are pointing to the leaf rout
  testCrumbs[testName] = testCrumbs;

  route.send("setBreadcrumbs", testCrumbs);
  assert.equal(route.get("breadcrumbs"), testCrumbs);

  route.send("setBreadcrumbs", {});
  assert.equal(route.get("breadcrumbs"), testCrumbs);

  route.send("setBreadcrumbs", null);
  assert.equal(route.get("breadcrumbs"), testCrumbs);
});

test('actions.bubbleBreadcrumbs test', function(assert) {
  let testName = "ts",
      route = this.subject({
        name: testName
      }),
      existingCrumbs = [1, 2],
      testCrumbs = [1, 2];

  route.set("breadcrumbs", existingCrumbs);

  route.send("bubbleBreadcrumbs", testCrumbs);
  assert.equal(testCrumbs.length, 2 + 2);
});
