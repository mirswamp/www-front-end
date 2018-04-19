<div id="java-bytecode-package-info" class="form-horizontal">
	<fieldset>
		<legend>Java bytecode info</legend>

		<div class="form-group">
			<label class="form-label">Class path</label>
			<div class="controls"><%- bytecode_class_path %></div>
		</div>

		<br />
		<div class="form-group">
			<% var showAdvanced = bytecode_aux_class_path || bytecode_source_path; %>

			<div id="advanced-settings" class="panel">
				<div class="panel-group">

					<div class="panel-heading">
						<label>Advanced settings</label>
					</div>

					<div id="advanced-settings" class="nested">
						<% if (showAdvanced) { %>
						<div id="path-settings" class="well">
							<h3><i class="fa fa-road"></i>Path settings</h3>

							<% if (bytecode_aux_class_path) { %>
							<div class="form-group">
								<label class="form-label">Aux class path</label>
								<div class="controls">
									<%- bytecode_aux_class_path %>
								</div>
							</div>
							<% } %>

							<% if (bytecode_source_path) { %>
							<div class="form-group">
								<label class="form-label">Source path</label>
								<div class="controls">
									<%- bytecode_source_path %>
								</div>
							</div>
							<% } %>

							<br />
						</div>
						<% } else { %>
						<p>No advanced settings have been defined. </p>
						<% } %>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
</form>