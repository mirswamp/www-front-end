<form action="/" class="form-horizontal" onsubmit="return false;">
	<% if (model.get('external_url')) { %>
	<div class="form-group">
		<label class="control-label">Use External URL</label>

		<div class="checkbox controls">
			<input type="checkbox" id="use-external-url" name="use_external_url" checked="checked" class="use-external-url" data-toggle="popover" data-placement="right" title="Use External URL" data-content="The external url is the address the SWAMP will attempt to clone or pull from. No file is required.">
			<span><%- model.get('external_url') %></span>
		</div>
	</div>
	<% } %>

	<div class="form-group">
		<label class="control-label">File</label>
		<div class="controls">
			<div class="input-group">
				<input type="file" class="form-control" id="archive" name="file" class="archive" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="File" data-content="The file is the compressed archive file containing the source code and other assorted files that make up the contents of your software package."></i>
				</div>
			</div>
			<a id="formats-supported" data-toggle="popover" title="Formats" data-content=".zip, .tar, .tar.gz, .tgz, .tar.bz2, .tar.xz, .tar.Z, .jar .war .ear .gem .whl, .apk">formats supported</a>
		</div>
	</div>

	<div id="package-version-profile-form"></div>

	<div class="progress invisible">
		<div class="bar bar-success" style="width: 0%;"><span class="bar-text"></span></div>
	</div>
</form>