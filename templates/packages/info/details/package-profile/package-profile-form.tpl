<form action="/" class="form-horizontal" onsubmit="return false;">
	<div class="form-group">
		<label class="required form-label">Name</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="required form-control" name="name" id="name" maxlength="100" class="required" value="<%- model.get('name') %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Name" data-content="The name of your software package, excluding the version."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">Description</label>
		<div class="controls">
			<div class="input-group">
				<textarea class="form-control" id="description" name="description" rows="3" maxlength="200"><%- model.get('description') %></textarea>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Description" data-content="Please include a short description of your package."></i>
				</div>
			</div>
		</div>
	</div>

	<div class="form-group">
		<label class="form-label">External URL</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" id="external-url" name="external-url" value="<%- model.get('external_url') %>"/>
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="External URL" data-content="The External URL is the address from which the SWAMP will attempt to clone or pull files for the package. Currently, only publicly clonable GitHub repository URLs are allowed. You may copy the URL from the &quot;HTTPS clone URL&quot; displayed on your GitHub repository page. The default branch will be used. Example: https://github.com/htcondor/htcondor.git" value="<%- model.get('external_url') %>"></i>
				</div>
			</div>
		</div>
	</div>

	<% if (package_type_id == undefined) { %>
	<div class="form-group">
		<label class="form-label">Language</label>
		<div class="controls">
			<select id="language-type" name="package-type" class="select required" data-toggle="popover" data-placement="right" title="Please specify a language type." data-content="This is the type of programming language used for the code contained in the software package." >
				<option value="none"></option>
				<option value="c">C/C++</option>
				<option value="java">Java</option>
				<option value="python">Python</option>
				<option value="ruby">Ruby</option>
			</select>
		</div>
	</div>

	<div class="form-group" id="java-type" style="display:none">
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

	<div class="form-group" id="python-version" style="display:none">
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
