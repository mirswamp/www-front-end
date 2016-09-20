<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-play"></i>API Report
	</h1>
</div>

<div class="modal-body">

	<ul class="nav nav-tabs" role="tablist">
		<li role="presentation" class="active">
			<a href="#actual-api-routes-content" aria-controls="actual-api-routes-content" role="tab" data-toggle="tab"><i class="fa fa-list"></i>Actual API Routes</a>
		</li>

		<li role="presentation">
			<a href="#undocumented-api-routes-content" aria-controls="undocumented-api-routes-content" role="tab" data-toggle="tab"><i class="fa fa-list"></i>Undocumented API Routes</a>
		</li>

		<li role="presentation">
			<a href="#obsolete-documented-api-routes-content" aria-controls="obsolete-documented-api-routes-content" role="tab" data-toggle="tab"><i class="fa fa-list"></i>Obsolete Documented API Routes</a>
		</li>
	</ul>

	<div class="tab-content">
		<div role="tabpanel" class="tab-pane active" id="actual-api-routes-content">
			<div style="width:100%; height:300px; padding-right:10px; overflow:auto">
				<p>The following are the actual API routes as reported by the servers.</p>
				<div id="actual-routes-list"><b>No routes.</b></div>
			</div>
		</div>

		<div role="tabpanel" class="tab-pane" id="undocumented-api-routes-content" >
			<div style="width:100%; height:200px; overflow:auto">
				<p>The following routes are present in the actual API but not in the API documentation.</p>
				<div id="undocumented-routes-list"><b>No routes.</b></div>
			</div>
		</div>

		<div role="tabpanel" class="tab-pane" id="obsolete-documented-api-routes-content" >
			<div style="width:100%; height:200px; overflow:auto">
				<p>The following routes are present in the API documentation but not in the actual API.</p>
				<div id="obsolete-documented-routes-list"><b>No routes.</b></div>
			</div>
		</div>
	</div>

</div>

<div class="modal-footer">
	<label class="pull-left">
		<input type="checkbox" id="show-numbering" <% if (showNumbering) { %>checked<% } %>>
		Show numbering
	</label>

	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>Ok</button> 
</div>