<div id="java-bytecode-package-info">
	<fieldset>
		<legend>Java bytecode info</legend>

		<div class="form-group">
			<label class="form-label">Class path</label>
			<div class="controls"><%- bytecode_class_path %></div>
		</div>

		<br />
		<div class="form-group">
			<% var showAdvanced = bytecode_aux_class_path || bytecode_source_path; %>

			<div class="panel" id="advanced-settings-accordion">
				<div class="panel-group">
					<div class="panel-heading">
						<label>
						<a class="accordion-toggle" data-toggle="collapse" data-parent="#advanced-settings-accordion" href="#advanced-settings">
							<i class="fa fa-minus-circle"></i>
							Advanced settings
						</a>
						</label>
					</div>
					<div id="advanced-settings" class="nested accordion-body collapse in">
						<% if (showAdvanced) { %>

						<div id="path-settings" class="well">
							<h3><i class="fa fa-road"></i>Path settings</h3>

							<% if (bytecode_aux_class_path) { %>
							<div class="form-group">
								<label class="form-label">Aux class path</label>
								<div class="controls"><%- bytecode_aux_class_path %></div>
							</div>
							<% } %>

							<% if (bytecode_source_path) { %>
							<div class="form-group">
								<label class="form-label">Source path</label>
								<div class="controls"><%- bytecode_source_path %></div>
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
