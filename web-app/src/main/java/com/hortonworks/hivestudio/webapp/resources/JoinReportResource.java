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
package com.hortonworks.hivestudio.webapp.resources;

import javax.inject.Inject;
import javax.ws.rs.GET;
import javax.ws.rs.Path;
import javax.ws.rs.PathParam;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;

import com.hortonworks.hivestudio.reporting.dto.JoinColumnResponse;
import com.hortonworks.hivestudio.reporting.services.JoinReportService;
import com.hortonworks.hivestudio.common.resource.RequestContext;

import io.dropwizard.jersey.jsr310.LocalDateParam;
import lombok.extern.slf4j.Slf4j;

/**
 * Resource class to generate the join reports for the tables
 */
@Slf4j
@Path("/reports/join")
public class JoinReportResource {


  private final JoinReportService joinReportService;

  @Inject
  public JoinReportResource(JoinReportService joinReportService) {
    this.joinReportService = joinReportService;
  }


  @GET
  @Path("/database/{id}")
  @Produces(MediaType.APPLICATION_JSON)
  public Response getJoinReportByDatabase(@PathParam("id") Integer databaseId,
                                          @QueryParam("startDate") LocalDateParam startDate,
                                          @QueryParam("endDate") LocalDateParam endDate,
                                          @QueryParam("algorithm") String algorithm,
                                          @QueryParam("groupedBy") String grouping,
                                          @Context RequestContext context) {
    log.info("Received startDate is {} and endDate is {}", startDate.get(), endDate.get());
    JoinColumnResponse joinColumnResponse = joinReportService.getJoinReport(databaseId, startDate.get(), endDate.get(), algorithm, grouping, context.getUsername());
    return Response.ok(joinColumnResponse).status(Response.Status.OK).build();
  }
  
}
