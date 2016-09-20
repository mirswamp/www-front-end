<div id="package-version-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Package</label>
		<div class="controls"><%- package.get('name') %></div>
	</div>

	<% if (version_string) { %>
	<div class="form-group">
		<label class="form-label">Version</label>
		<div class="controls"><%- version_string %></div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">Filename</label>
		<div class="controls"><%- filename %></div>
	</div>

	<fieldset>
		<legend>Dates</legend>

		<% if (model.hasCreateDate()) { %>
		<div class="form-group">
			<label class="form-label">Creation date</label>
			<div class="controls"><%= dateToHTML(model.getCreateDate()) %></div>
		</div>
		<% } %>

		<% if (model.hasUpdateDate()) { %>
		<div class="form-group">
			<label class="form-label">Last modified date</label>
			<div class="controls"><%= dateToHTML(model.getUpdateDate()) %></div>
		</div>
		<% } %>

		<% if (model.has('release_date')) { %>
		<div class="form-group">
			<label class="form-label">Release date</label>
			<div class="controls"><%= dateToHTML(model.get('release_date')) %></div>
		</div>
		<% } %>

		<% if (model.has('retire_date')) { %>
		<div class="form-group">
			<label class="form-label">Retire date</label>
			<div class="controls"><%= dateToHTML(model.get('retire_date')) %></div>
		</div>
		<% } %>
	</fieldset>

	<div class="form-group">
		<label class="form-label">Version notes</label>
		<div class="controls"><%- typeof notes !== 'undefined' && notes? notes : 'none' %></div>
	</div>
</div>
