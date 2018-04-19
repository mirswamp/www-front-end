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
			<div id="git-message" class="alert alert-info">
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
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="Checkout argument" data-html="true" data-content="<p>This is a string passed to the checkout command to fetch a particular branch, tag, or version of the code repository. The checkout command is run after the repository is cloned from the External URL.</p><b><i>Git command: </b></i><br/><pre>git checkout [argument]</pre>"></i>
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