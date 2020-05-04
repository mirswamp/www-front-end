<div id="package-version-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Version</label>
		<div class="controls"><%- version_string %></div>
	</div>

	<% if (typeof create_date !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= datetimeToHTML(create_date) %></div>
	</div>
	<% } %>

	<% if (typeof update_date !== undefined) { %>
	<div class="form-group" style="display:none">
		<label class="form-label">Last modified</label>
		<div class="controls"><%= datetimeToHTML(update_date) %></div>
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