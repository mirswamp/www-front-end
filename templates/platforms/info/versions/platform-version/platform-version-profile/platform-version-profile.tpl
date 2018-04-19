<div id="package-version-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Version</label>
		<div class="controls"><%- version_string %></div>
	</div>

	<% if (model.hasCreateDate()) { %>
	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= datetimeToHTML(model.getCreateDate()) %></div>
	</div>
	<% } %>

	<% if (model.hasUpdateDate()) { %>
	<div class="form-group" style="display:none">
		<label class="form-label">Last modified</label>
		<div class="controls"><%= datetimeToHTML(model.getUpdateDate()) %></div>
	</div>
	<% } %>

	<% if (typeof notes !== 'undefined') { %>
	<fieldset>
		<legend>Notes</legend>
		<div class="form-group">
			<label class="form-label">Notes</label>
			<div class="controls"><%- notes %></div>
		</div>
	</fieldset>
	<% } %>
</div>
