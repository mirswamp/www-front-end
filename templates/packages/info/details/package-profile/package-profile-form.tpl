<form action="/" class="form-horizontal" onsubmit="return false;">

	<div id="name" class="form-group">
		<label class="required control-label">Name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="name" maxlength="100" class="required" value="<%- model.get('name') %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="The name of your software package, excluding the version."></i>
				</div>
			</div>
		</div>
	</div>

	<div id="description" class="form-group">
		<label class="control-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="form-control" name="description" rows="3" maxlength="200"><%- model.get('description') %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your package."></i>
				</div>
			</div>
		</div>
	</div>

	<div id="external-url" class="form-group">
		<label class="control-label">External URL</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" name="external-url" value="<%- model.get('external_url') %>"/>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="External URL" data-html="true" data-content="<p>This is the web address from which the SWAMP will attempt to clone or pull files for the package.</p><p>To find this URL, <b>go to your GitHub repository web page</b> and click the green 'Clone or download' button. </p><div style='text-align:center'><img width='143px' src='images/other/github-clone-or-download-button.png'></div><br/><b><i>Git command: </b></i><br/><pre style='word-break:keep-all'>git clone --recursive [external URL]</pre>"></i>
				</div>
			</div>
		</div>
	</div>

	<br />
	<fieldset>
		<legend>GitHub Webhook Callback</legend>

		<div id="payload-url" class="form-group">
			<label class="control-label">Payload URL</label>
			<div class="controls">
				<div class="input-group">
					<p class="form-control form-control-static"><%- payload_url %>
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="External URL" data-content="This is the callback that GitHub can use to update a package upon each commit. To use this token, you will need to enter it into GitHub when you create a GitHub webhook."></i></p>
				</div>
			</div>
		</div>

		<div id="secret-token" class="form-group">
			<label class="control-label">Secret Token</label>
			<div class="controls">
				<div class="input-group">
					<input type="text" class="form-control" name="secret-token" value="<%- model.get('secret_token') %>"/>
					<div class="input-group-addon">
						<i class="active fa fa-question-circle" data-toggle="popover" data-placement="left" data-container="body" title="Secret Token" data-content="This is a token that is used to authenticate requests from GitHub to update a package. To use this token, you will need to enter it into GitHub when you create a GitHub webhook."></i>
					</div>
				</div>
			</div>
			<button id="generate-token" class="btn">Generate</button>
		</div>
	</fieldset>

	<% if (package_type_id == undefined) { %>
	<div id="language-type" class="form-group">
		<label class="control-label">Language</label>
		<div class="controls">
			<select name="package-type" class="select required" data-toggle="popover" data-placement="right" title="Please specify a language type." data-content="This is the type of programming language used for the code contained in the software package." >
				<option value="none"></option>
				<option value="c">C/C++</option>
				<option value="java">Java</option>
				<option value="python">Python</option>
				<option value="ruby">Ruby</option>
				<option value="web-scripting">Web Scripting (HTML, Javascript, PHP, CSS, or XML)</option>
				<option value=".net">.NET</option>
			</select>
		</div>
	</div>

	<div id="java-type" class="form-group" style="display:none">
		<div class="controls">
			<label class="radio">
				<input type="radio" name="java-type" value="java-source" checked />
				Java source
				<p>The package contains uncompiled Java code in its original source code format (.java files).</p>
			</label>
			<label class="radio">
				<input type="radio" name="java-type" value="java-bytecode" />
				Java bytecode
				<p>The package contains Java code which has been compiled (.class, .jar, or .apk files).</p>
			</label>
		</div>
	</div>

	<div id="python-version" class="form-group" style="display:none">
		<div class="controls">
			<label class="radio">
				<input type="radio" name="python-version" value="python2" checked />
				Python2
				<p>The package contains Python source code in its original (2000 - 2008) dialect (version 2.x).</p>
			</label>
			<label class="radio">
				<input type="radio" name="python-version" value="python3" />
				Python3
				<p>The package contains Python source code in its most recent (2008 onwards) dialect (3.x).</p>
			</label>
		</div>
	</div>
	<% } %>

	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>