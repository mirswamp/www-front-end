<div id="package-version-source-profile" class="form-horizontal">

	<div class="well">
		<% if (package.isOwned()) { %>
		<button id="edit-source-info" class="btn" style="float:right"><i class="fa fa-pencil"></i>Edit</button>
		<% } %>

		<% if (!model.isAtomic()) { %>
		<div class="form-group">
			<label class="form-label">Package path</label>
			<div class="controls"><%- source_path %></div>
		</div>
		<% } %>

		<% if (language_version || package.hasLanguageVersion()) { %>
		<div class="form-group">
			<label class="form-label">Language version</label>
			<div class="controls">
				<% if (language_version) {%>
					<%- language_version %>
				<%} else { %>
					default
				<% } %>
			</div>
		</div>
		<% } %>

		<div class="form-group">
			<label class="form-label">Package version contents</label>
			<div class="controls">
				<p>The following is a listing of the contents of this package version.</p>
				<div id="contents"></div>
			</div>
		</div>
	</div>

</div>