<form action="/" class="form-horizontal" onsubmit="return false;">
	<fieldset>
		<legend>Package info</legend>

		<div class="form-group" id="name">
			<label class="required control-label">Name</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="name" maxlength="100" class="required" value="<%- name %>" />
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
					<textarea class="form-control" name="description" rows="3" maxlength="200"><%- description %></textarea>
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
					<input type="radio" name="file-source" value="local"<% if (!external_url_type) { %> checked<% } %> />
					Local file system
					<p>The package source code is located in an archive file on your local hard drive.</p>
				</label>
				<label class="radio">
					<input type="radio" name="file-source" value="download"<% if (external_url_type == 'download') { %> checked<% } %> />
					Remote file server
					<p>The package source code is located in an archive file on a remote file server.</p>
				</label>
				<label class="radio">
					<input type="radio" name="file-source" value="git"<% if (external_url_type == 'git') { %> checked<% } %> />
					Remote Git repository
					<p>The package source code is located on a remote Git server.</p>
				</label>
				<div id="git-message" class="alert alert-info" style="display:none">
					<label>Note: </label>
					<span class="message">
						<ul>
							<li>The remote Git repository must be <b>publicly cloneable</b>. </li>
							<li>The repository will be cloned recursively, so it will include any nested sub-module. </li>
							<li>The clone operation occurs at package creation time, not when packages are assessed.</li>
						</ul>
					</span>
				</div>
			</div>
		</div>

		<div class="form-group" id="external-url"<% if (!(external_url && hasValidArchiveUrl)) { %> style="display:none"<% } %>>
			<label class="required control-label">External URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="external-url" value="<%- external_url %>"/>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="External URL" data-html="true" data-content="<p>This is the web address from which the SWAMP will attempt to pull files for the package." value="<%- external_url %>"></i>
					</div>
				</div>
				<p><a id="formats-supported" data-toggle="popover" title="Formats" data-content=".zip, .tar, .tar.gz, .tgz, .tar.bz2, .tar.xz, .tar.Z, .jar .war .ear .gem .whl, .apk">formats supported</a></p>
			</div>
		</div>
	</fieldset>

	<fieldset id="webhook-callback"<% if (!(external_url && !hasValidArchiveUrl)) { %> style="display:none"<% } %>>
		<legend>GitHub Info</legend>

		<div class="form-group" id="external-git-url">
			<label class="required control-label">External Git URL</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="required form-control" name="external-git-url" value="<%- external_url %>"/>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="External Git URL" data-html="true" data-content="<p>This is the web address from which the SWAMP will attempt to clone or pull files for the package. To find this URL, <b>go to your GitHub repository web page</b> and click the green 'Clone or download' button. </p><div style='text-align:center'><img width='143px' src='images/other/github-clone-or-download-button.png'></div><br /><b><i>Git command: </b></i><br/><pre style='word-break:keep-all'>git clone --recursive [external URL]</pre>" value="<%- external_url %>"></i>
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
