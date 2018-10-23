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

package com.hortonworks.hivestudio.reporting.dao;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;
import java.util.Optional;

import org.jdbi.v3.sqlobject.config.RegisterBeanMapper;
import org.jdbi.v3.sqlobject.customizer.Bind;
import org.jdbi.v3.sqlobject.customizer.BindBean;
import org.jdbi.v3.sqlobject.customizer.BindList;
import org.jdbi.v3.sqlobject.statement.GetGeneratedKeys;
import org.jdbi.v3.sqlobject.statement.SqlQuery;
import org.jdbi.v3.sqlobject.statement.SqlUpdate;

import com.hortonworks.hivestudio.common.repository.JdbiDao;
import com.hortonworks.hivestudio.reporting.entities.tablestat.TSWeekly;

@RegisterBeanMapper(TSWeekly.class)
public interface TSWeeklyDao extends JdbiDao<TSWeekly, Integer> {
  @SqlQuery("select * from das.table_stats_weekly where id = :id")
  Optional<TSWeekly> findOne(@Bind("id") Integer id);

  @SqlQuery("select * from das.table_stats_weekly")
  Collection<TSWeekly> findAll();

  @SqlUpdate("insert into das.table_stats_weekly (table_id, read_count, write_count, " +
      "bytes_read, records_read, bytes_written, records_written, date) values (:tableId, " +
      ":readCount, :writeCount, :bytesRead, :recordsRead, :bytesWritten, :recordsWritten, :date)")
  @GetGeneratedKeys
  Integer insert(@BindBean TSWeekly entity);

  @SqlUpdate("update das.table_stats_weekly set table_id = :tableId, read_count = :readCount, " +
      "write_count = :writeCount, bytes_read = :bytesRead, records_read = :recordsRead, " +
      "bytes_written = :bytesWritten, records_written = :recordsWritten, date = :date where id = :id")
  int update(@BindBean TSWeekly entity);

  @SqlUpdate("delete from das.table_stats_weekly where id = :id")
  int delete(@Bind("id") Integer id);

  @SqlQuery("select ts.* from das.table_stats_weekly ts join das.tables t on t.id = ts.table_id " +
      "where t.db_id = :dbId AND ts.date between :startDate and :endDate")
  Collection<TSWeekly> getAllForDatabaseWithinTimeRange(@Bind("dbId") Integer dbId,
      @Bind("startDate") LocalDate startDate, @Bind("endDate") LocalDate endDate);

  @SqlQuery("select * from das.table_stats_weekly where table_id in (<tableIds>) and " +
      "date between :startDate and :endDate")
  Collection<TSWeekly> getAllForTableWithinTimeRange(@BindList("tableIds") List<Integer> tableIds,
      @Bind("startDate") LocalDate startDate, @Bind("endDate") LocalDate endDate);
}
