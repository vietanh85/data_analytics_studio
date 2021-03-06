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

export default Ember.Route.extend({
  breadCrumb: null,

  beforeModel() {
    let existingWorksheets = this.store.peekAll('worksheet');
    let newWorksheetName = 'worksheet';
    if(!this.controllerFor("queries").worksheetCount && !existingWorksheets.get("length")) {
      newWorksheetName = newWorksheetName + 1;
    } else {
      let id = parseInt(this.controllerFor("queries").worksheetCount);
      if(!id){
        id = existingWorksheets.get("length")+1;
      }
      id = parseInt(id) - 1;
      newWorksheetName = newWorksheetName + id;
    }
    if(!existingWorksheets.filterBy('id', "saved").get('firstObject')) {
      this.store.createRecord('worksheet', {
        id: "saved",
        title: "Saved".capitalize(),
        isQueryDirty: false,
        selected: false
      });
    }

    let newWorksheetTitle = newWorksheetName.capitalize();
    this.store.createRecord('worksheet', {
      id: newWorksheetName,
      title: newWorksheetTitle,
      isQueryDirty: false,
      //query: 'select 1;',
      //owner: 'admin',
      selected: true
    });
    existingWorksheets.setEach('selected', false);
    this.controllerFor('queries').set('worksheets', this.store.peekAll('worksheet'));
    this.transitionTo('queries.query', newWorksheetTitle);
  }
});
