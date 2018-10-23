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

import { moduleForComponent, test } from 'ember-qunit';
import hbs from 'htmlbars-inline-precompile';

import Process from 'hivestudio/utils/process';
import Processor from 'hivestudio/utils/processor';

import wait from 'ember-test-helpers/wait';

moduleForComponent('em-swimlane-event', 'Integration | Component | em swimlane event', {
  integration: true
});

test('Basic creation test', function(assert) {
  this.set("process", Process.create({}));
  this.set("processor", Processor.create());

  this.render(hbs`{{em-swimlane-event processor=processor process=process}}`);

  assert.ok(this.$(".event-bar"));
  assert.ok(this.$(".event-window"));

  // Template block usage:" + EOL +
  this.render(hbs`
    {{#em-swimlane-event process=process processor=processor}}
      template block text
    {{/em-swimlane-event}}
  `);

  assert.ok(this.$(".event-bar"));
  assert.ok(this.$(".event-window"));
});

test('Event position test', function(assert) {
  this.set("process", Process.create());
  this.set("event", {
    time: 6
  });
  this.set("processor", Processor.create({
    startTime: 0,
    endTime: 10
  }));

  this.render(hbs`{{em-swimlane-event processor=processor process=process event=event}}`);

  return wait().then(() => {
    assert.equal(this.$(".em-swimlane-event").attr("style").trim(), "left: 60%;", "em-swimlane-event");
  });
});
