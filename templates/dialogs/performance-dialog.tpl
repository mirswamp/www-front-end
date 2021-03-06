<div class="modal-header">
	<button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
	<h1 id="modal-header-text">
		<i class="fa fa-rocket"></i>
		Performance
	</h1>
</div>

<div class="modal-body">
	<form class="vertically scrollable form-horizontal" style="max-height:250px">
		<p>The following events are used to measure the timing of the application loading and rendering process.  These event times are shown relative to the initial navigation start event.</p>

		<div class="form-group">
			<label class="control-label">URL</label>
			<div class="controls">
				<p class="form-control-static">
					<%= timing.url %>
				</p>
			</div>
		</div>

		<div class="form-group">
			<label class="control-label">Page content shown</label>
			<div class="controls">
				<p class="form-control-static">
					<%= (timing['page content shown'] - window.performance.timing.navigationStart) / 1000 %> seconds
				</p>
			</div>
		</div>

		<div class="panel-group" id="details-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#details-accordion" href="#details-info">
						<% if (collapsed) { %>
							<i class="fa fa-plus-circle"></i>
						<% } else { %>
							<i class="fa fa-minus-circle"></i>
						<% } %>
						Details
					</a>
					</label>
				</div>

				<div id="details-info" class="nested panel-collapse collapse<% if (!collapsed) { %> in<% } %>">

					<div class="form-group">
						<label class="control-label">User agent</label>
						<div class="controls">
							<p class="form-control-static">
								<%= navigator.userAgent %>
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Client IP address</label>
						<div class="controls">
							<p class="form-control-static">
								<%= application.config.client_ip %>
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Domain lookup start</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.domainLookupStart - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Domain lookup end</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.domainLookupEnd - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Connect start</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.connectStart - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Connect end</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.connectEnd - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Javascript started</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (timing['start'] - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">DOM complete</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.domComplete - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Load event start</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.loadEventStart - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>
					
					<div class="form-group">
						<label class="control-label">Document ready</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (timing['document ready'] - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>

					<div class="form-group">
						<label class="control-label">Load event end</label>
						<div class="controls">
							<p class="form-control-static">
								<%= (window.performance.timing.loadEventEnd - window.performance.timing.navigationStart) / 1000 %> seconds
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</form>
</div>

<div class="modal-footer">
	<button id="ok" class="btn btn-primary" data-dismiss="modal"><i class="fa fa-check"></i>OK</button> 
</div>