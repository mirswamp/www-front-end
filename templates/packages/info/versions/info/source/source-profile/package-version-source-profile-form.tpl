<form action="/" class="form-horizontal" onsubmit="return false;">

	<div class="form-group"<% if (isAtomic) { %> style="display:none"<% } %>>
		<label class="required control-label">Package path</label>
		<div class="controls">
			<div class="input-group">
				<input id="package-path" class="required form-control" name="package-path" type="text" maxlength="1000" value="<%- source_path %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Package path" data-content="This is the name of the directory / folder within the compressed package file that contains your package source code. "></i>
				</div>
			</div>
		</div>
		<div class="buttons">
			<button id="select-package-path" class="btn"><i class="fa fa-list"></i>Select</button>
		</div>
	</div>

	<% if (language_version || hasLanguageVersion) { %>
	<div class="form-group" id="language-version">
		<label class="required control-label">Language version</label>
		<div class="controls">
			<select name="language-version" style="margin-right:15px">
				<option value="default"<% if (!language_version) { %> selected<% } %>>default</option>
				<option value="other"<% if (language_version && isOther) { %> selected<% } %>>other</option>
				<% for (var i = 0; i < languageVersions.length; i++) { %>
				<option value="<%= languageVersions[i] %>"<% if (language_version == languageVersions[i]) { %> selected<% } %>><%= languageVersions[i] %></option>
				<% } %>
			</select>
			<div class="options">
				<button id="show-gem-info" class="btn"><i class="fa fa-diamond"></i>Show Gem Info</button>
			</div>
		</div>
	</div>
	<% } else { %>
	<% if (isAtomic) { %>
	<p>No package source information may be specified for this type of package.</p>
	<% } %>
	<% } %>

	<div class="other-language-version form-group"<% if (!language_version || !isOther) { %> style="display:none"<% } %>>
		<label class="control-label">Other language version</label>
		<div class="controls" style="width:150px">
			<div class="input-group">
				<input type="text" class="form-control" value="<%= language_version %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Other language version" data-content="This is a version string for the language in case the version is not provided by the selector. "></i>
				</div>
			</div>
		</div>
	</div>
</form>