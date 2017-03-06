<form action="/" class="form-horizontal" onsubmit="return false;">

	<% if (!package.isNew() && package.has('external_url')) { %>
	<div class="form-group" id="file-source">
		<label class="control-label">File source</label>
		<div class="controls">
			<label class="radio">
				<input type="radio" name="file-source" value="use-local-file"<% if (!model.has('external_url')) { %> checked<% } %> />
				Local file system
				<p>The package source code is located on your local hard drive.</p>
			</label>
			<label class="radio">
				<input type="radio" name="file-source" value="use-external-url"<% if (model.has('external_url')) { %> checked<% } %>/>
				Remote Git repository
				<p>The package source code is located on a remote Git server.</p>
			</label>
		</div>
	</div>

	<div class="form-group" id="external-url">
		<label class="control-label">External URL</label>
		<div class="controls">
			<div class="form-control-static">
				<span><%- model.get('external_url') %></span>
			</div>
		</div>
	</div>
	<% } %>

	<div class="form-group" id="checkout-argument"<% if (!package.has('external_url')) { %> style="display:none"<% } %>>
		<label class="control-label">Checkout argument</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" value="<%= model.get('checkout_argument') %>">
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Checkout argument" data-content="This is a string passed to the checkout command after the external URL to fetch a particular branch, tag, or version of the code repository."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group" id="file"<% if (package.has('external_url')) { %> style="display:none"<% } %>>
		<label class="required control-label">File</label>
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