<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Package info</legend>

		<div class="form-group" id="name">
			<label class="required control-label">Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="name" maxlength="100" class="required" value="<%- model.get('name') %>" />
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body"  title="Name" data-content="The name of your software package, excluding the version."></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group" id="description">
			<label class="control-label">Description</label>
			<div class="controls">
				<div class="input-group">
					<textarea class="form-control" name="description" rows="3" maxlength="200"><%- model.get('description') %></textarea>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your package. "></i>
					</div>
				</div>
			</div>
		</div>

		<div class="form-group" id="file-source">
			<label class="control-label">File source</label>
			<div class="controls">
				<label class="radio">
					<input type="radio" name="file-source" value="use-local-file"<% if (!model.has('external_url')) { %> checked<% } %> />
					Local file system
					<p>The package source code is located on your local hard drive.</p>
				</label>
				<label class="radio">
					<input type="radio" name="file-source" value="use-external-url"<% if (model.has('external_url')) { %> checked<% } %> />
					Remote Git repository
					<p>The package source code is located on a remote Git server.</p>
				</label>
			</div>
		</div>

		<div class="form-group" id="external-url"<% if (!model.has('external_url')) { %> style="display:none"<% } %>>
			<label class="required control-label">External URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="external-url" value="<%- model.get('external_url') %>"/>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="External URL" data-content="This is the web address from which the SWAMP will attempt to clone or pull files for the package. Only publicly clonable GitHub repository URLs are allowed. You may copy the URL from the &quot;HTTPS clone URL&quot; displayed on your GitHub repository page." value="<%- model.get('external_url') %>"></i>
					</div>
				</div>
			</div>
		</div>
	</fieldset>
	
	<fieldset>
		<legend>Package version info</legend>
		<div id="new-package-version-profile-form"></div>
	</fieldset>
</form>
