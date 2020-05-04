<% if (isOwned) { %>
<button id="edit-package" class="btn" style="float:right"><i class="fa fa-pencil"></i>Edit</button>
<% } %>

<div id="package-profile" class="form-horizontal">

	<div class="form-group">
		<label class="form-label">Name</label>
		<div class="controls"><%- name %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls"><%- description? description : 'none' %></div>
	</div>

	<% if (package_type) { %>
	<div class="form-group">
		<label class="form-label">Language</label>
		<div class="controls">
			<%- package_type %>
			<% if (package_type == 'Web Scripting' && package_language) { %>
			(<%- package_language.join(', ') %>)
			<% } %>
		</div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="form-label">Creation date</label>
		<div class="controls"><%= datetimeToHTML(create_date) %></div>
	</div>

	<div class="form-group">
		<label class="form-label">Last modified date</label>
		<div class="controls"><%= datetimeToHTML(update_date) %></div>
	</div>

	<% if (typeof external_url !== 'undefined') { %>
	<div class="form-group">
		<label class="form-label">File source</label>
		<div class="controls"><%- external_url_type? external_url_type : 'download' %></div>
	</div>
	
	<% if (external_url_type == 'git') { %>
	<div class="form-group">
		<label class="form-label">External Git URL</label>
		<div class="controls"><%- external_url? external_url : 'none' %></div>
	</div>

	<fieldset>
		<legend>GitHub Webhook Callback</legend>

		<div class="form-group">
			<label class="form-label">Secret Token</label>
			<div class="controls"><%- secret_token %></div>
		</div>
	</fieldset>
	<% } else { %>
	<div class="form-group">
		<label class="form-label">External URL</label>
		<div class="controls"><%- external_url? external_url : 'none' %></div>
	</div>
	<% } %>
	<% } %>
</div>
