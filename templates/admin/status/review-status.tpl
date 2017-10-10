<h1><div class="icon"><i class="fa fa-dashboard"></i></div>Review Status</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><i class="fa fa-dashboard"></i>Review Status</li>
</ol>

<div style="float:left">
	<label style="line-height:40px">
		<input type="checkbox" id="auto-refresh" <% if (autoRefresh) { %>checked<% } %>>
		Auto refresh
	</label>
	<button id="refresh" class="btn"<% if (autoRefresh) { %> style="display:none"<% } %>><i class="fa fa-refresh"></i>Refresh</button>
</div>
<div style="clear:both"></div>

<div id="status">
	<h2>Summary</h2>
	<div id="run-queue-summary"></div>

	<h2>Details</h2>
	<ul class="nav nav-tabs">

		<li id="run-queue-tab" class="active">
			<a role="tab" data-toggle="tab" href="#run-queue-panel"><i class="fa fa-list"></i>Run Queue</a>
		</li>

		<li id="run-status-tab">
			<a role="tab" data-toggle="tab" href="#run-status-panel"><i class="fa fa-check"></i>Run Status</a>
		</li>

		<li id="viewer-status-tab">
			<a role="tab" data-toggle="tab" href="#viewer-status-panel"><i class="fa fa-eye"></i>Viewer Status</a>
		</li>
	</ul>

	<div class="tab-content">

		<div id="run-queue-panel" role="tabpanel" class="tab-pane active">
			<div id="run-queue">No run queue.</div>
		</div>

		<div id="run-status-panel" role="tabpanel" class="tab-pane">
			<div id="run-status-list">No runs.</div>
		</div>

		<div id="viewer-status-panel" role="tabpanel" class="tab-pane">
			<div id="viewer-status-list">No viewers.</div>
		</div>
	</div>
</div>