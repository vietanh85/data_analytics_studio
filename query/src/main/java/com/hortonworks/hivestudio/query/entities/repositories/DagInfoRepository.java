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
package com.hortonworks.hivestudio.query.entities.repositories;

import java.util.Collection;
import java.util.Optional;

import javax.inject.Inject;

import com.hortonworks.hivestudio.common.entities.DagInfo;
import com.hortonworks.hivestudio.common.repository.JdbiRepository;
import com.hortonworks.hivestudio.query.entities.daos.DagInfoDao;

/**
 * JDBI repository for dag_info table.
 */
public class DagInfoRepository extends JdbiRepository<DagInfo, Long, DagInfoDao> {
  @Inject
  public DagInfoRepository(DagInfoDao dao){
    super(dao);
  }

  public Optional<DagInfo> findByDagId(String dagId) {
    return dao.getByDagId(dagId);
  }

  public Optional<DagInfo> getByHiveQueryTableId(Long hiveQueryId) {
    return dao.getByHiveQueryTableId(hiveQueryId);
  }

  @Override
  public Optional<DagInfo> findOne(Long id) {
    return dao.findOne(id);
  }

  @Override
  public Collection<DagInfo> findAll() {
    return dao.findAll();
  }

  @Override
  public DagInfo save(DagInfo entity) {
    if (entity.getId() == null) {
      Long id = dao.insert(entity);
      entity.setId(id);
    } else {
      dao.update(entity);
    }
    return entity;
  }

  @Override
  public boolean delete(Long id) {
    return dao.delete(id) != 0;
  }
}
