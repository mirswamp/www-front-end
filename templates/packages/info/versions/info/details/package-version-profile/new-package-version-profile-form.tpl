<form action="/" class="form-horizontal" onsubmit="return false;">

	<% if (package.has('external_url')) { %>
	<div class="form-group" id="external-url">
		<label class="control-label">External URL</label>
		<div class="controls">
			<div class="form-control-static">
				<span><%- package.get('external_url') %></span>
				<i class="active fa fa-question-circle" data-toggle="popover" data-container="body" title="External URL" data-html="true" data-content="<p>This is the URL that the package source code is retreived from and is an attribute of the package.  If you would like to change this attribute, edit the package attributes before adding a new version."></i>
			</div>
		</div>
	</div>
	<% } %>

	<div class="form-group" id="file"<% if (package.has('external_url')) { %> style="display:none"<% } %>>
		<label class="required control-label">File</label>
		<div class="controls">
			<div class="input-group">
				<input type="file" class="form-control" id="archive" name="file" class="archive" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="File" data-content="The file is the compressed archive file containing the source code and other assorted files that make up the contents of your software package."></i>
				</div>
			</div>
			<p><a id="formats-supported" data-toggle="popover" title="Formats" data-content=".zip, .tar, .tar.gz, .tgz, .tar.bz2, .tar.xz, .tar.Z, .jar .war .ear .gem .whl, .apk">formats supported</a></p>
			<p>For help creating package archives, you may wish to use the <a href="https://github.com/mirswamp/create_swamp_archive" target="_blank">create_swamp_archive</a> utiity.</p>
		</div>
	</div>

	<div id="package-version-profile-form"></div>

	<div class="progress invisible">
		<div class="bar"></div>
		<span class="bar-text">
			<span class="bar-message">Cloning repository</span>
			<span class="bar-percentage"></span>
		</span>
	</div>
</form>