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
			<select name="language-version" class="required">
				<option<% if (!language_version) { %> selected<% } %>>default</option>
				<option<% if (language_version == '2.2.2') { %> selected<% } %>>2.2.2</option>
				<option<% if (language_version == '2.2.1') { %> selected<% } %>>2.2.1</option>
				<option<% if (language_version == '2.1.5') { %> selected<% } %>>2.1.5</option>
				<option<% if (language_version == '2.1.4') { %> selected<% } %>>2.1.4</option>
				<option<% if (language_version == '2.0.0') { %> selected<% } %>>2.0.0</option>
				<option<% if (language_version == '1.9.3') { %> selected<% } %>>1.9.3</option>
				<option<% if (language_version == '1.9.2') { %> selected<% } %>>1.9.2</option>
				<option<% if (language_version == '1.9.1') { %> selected<% } %>>1.9.1</option>
				<option<% if (language_version == '1.8.7') { %> selected<% } %>>1.8.7</option>
				<option<% if (language_version == '1.8.6') { %> selected<% } %>>1.8.6</option>
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
</form>