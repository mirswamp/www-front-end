<h1>
	<div class="icon"><i class="fa fa-check"></i></div>
	<span id="title"><%= title %></span>
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-check"></i><span id="breadcrumb"><%= shortTitle %></span></li>
</ol>

<% if (showNavigation) { %>
<ul class="well nav nav-pills">
	<li><a id="assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><a id="runs"><i class="fa fa-bus"></i>Runs</a></li>
</ul>
<% } %>

<p>Assessment results contain the results of an assessment run of a package using a tool on a particular platform. You may view the results of a single assessment run or you may view the output of several runs of a package using different tools in order to compare the results. </p>

<div id="assessment-runs-filters"></div>
<br />

<div class="filters panel-group" id="viewers-accordion">
	<div class="panel">
		<div class="panel-heading">
			<div class="form-inline">
				<label>
					<i class="fa fa-eye" ></i>
					Viewer
				</label>
				<% for (var i = 0; i < viewers.length; i++) { %>
				<div class="radio-inline">
					<label>
						<input type="radio" name="viewers" id="<%- viewers.at(i).get('name') %>" index="<%- i %>" <% if (i == 0) { %>checked<% } %>>
						<%- viewers.at(i).get('name') %>
					</label>
				</div>
				<% } %>
			</div>
		</div>
	</div>
</div>

<br />

<div class="alert alert-info" style="display:none">
	<button type="button" class="close" data-dismiss="alert"><i class="fa fa-close"></i></button>
	<label>Notice: </label><span class="message"></span>
</div>

<div style="float:left">
	<label style="line-height:40px">
		<input type="checkbox" id="auto-refresh" <% if (autoRefresh) { %>checked<% } %>>
		Auto refresh
	</label>
	<button id="refresh" class="btn"<% if (autoRefresh) { %> style="display:none"<% } %>><i class="fa fa-refresh"></i>Refresh</button>
</div>

<div class="top buttons">
	<!-- <button id="view-results" class="btn"><i class="fa fa-eye"></i>View Assessment Results</button> -->
	<a id="view-results" class="btn btn-primary" target="_blank"><i class="fa fa-eye"></i>View Assessment Results</a>
</div>

<div style="clear:both"></div>

<div id="assessment-runs-list">
	<div align="center"><i class="fa fa-spinner fa-spin fa-2x"></i><br/>Loading assessment runs...</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<label>
	<input type="checkbox" id="show-grouping" <% if (showGrouping) { %>checked<% } %>>
	Show grouping
</label>

<div class="bottom buttons">
	<button id="delete-results" class="btn btn-lg"><i class="fa fa-trash"></i>Delete Assessment Results</button>
</div>
