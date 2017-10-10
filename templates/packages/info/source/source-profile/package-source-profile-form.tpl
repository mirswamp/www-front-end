<form action="/" class="form-horizontal" onsubmit="return false;">

	<div class="form-group"<% if (model.isAtomic()) { %> style="display:none"<% } %>>
		<label class="required control-label">Package path</label>
		<div class="controls">
			<div class="input-group">
				<input type="text" class="form-control" id="package-path" name="package-path" maxlength="1000" class="required" value="<%- model.get('source_path') %>" />
				<div class="input-group-addon">
					<i class="active fa fa-question-circle" data-toggle="popover" data-placement="top" data-container="body" title="Package path" data-content="This is the name of the directory / folder within the compressed package file that contains your package source code. "></i>
				</div>
			</div>
		</div>
		<div class="buttons">
			<button id="select-package-path" class="btn"><i class="fa fa-list"></i>Select</button>
		</div>
	</div>

	<% var packageType = package.getPackageType() %>
	<div class="form-group">
		<label class="required control-label">Language</label>
		<div class="controls">
			<select id="language-type" name="language-type" class="required" >
				<% if (!packageType) { %>
				<option value="none"></option>
				<% } %>
			</select>
			<br /><br />
			<div class="options">
				<button id="show-file-types" class="btn"><i class="fa fa-file"></i>Show File Types</button>
			</div>
		</div>
	</div>

	<div class="form-group" id="language-version" <% if (packageType != 'ruby') {%>style="display:none"<% } %>>
		<label class="required control-label">Language version</label>
		<div class="controls">
			<select name="language-version" class="required">
				<option>default</option>
				<option>2.2.2</option>
				<option>2.2.1</option>
				<option>2.1.5</option>
				<option>2.1.4</option>
				<option>2.0.0</option>
				<option>1.9.3</option>
				<option>1.9.2</option>
				<option>1.9.1</option>
				<option>1.8.7</option>
				<option>1.8.6</option>
			</select>
			<div class="options">
				<button id="show-gem-info" class="btn"><i class="fa fa-diamond"></i>Show Gem Info</button>
			</div>
		</div>
	</div>
	<br />

	<!-- java types -->
	<div class="form-group" id="java-type" <% if (packageType != 'java-source' && packageType != 'java-bytecode') { %>style="display:none"<% } %>>
		<div class="panel-group" id="java-type-info-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#java-type-info-accordion" href="#java-type-info">
						<i class="fa fa-minus-circle"></i>
						Java type
					</a>
					</label>
				</div>

				<div id="java-type-info" class="nested panel-collapse collapse in">
					<div class="radio">
						<label class="radio" id="java-source">
							<input type="radio" name="java-type" value="java-source" <% if (!packageType || packageType == 'java7-source' || packageType == 'java8-source') { %>checked<% } %> />
							Java source
							<p>The package contains uncompiled Java code in its original source code format (.java files).</p>
						</label>
						<label class="radio" id="java-bytecode">
							<input type="radio" name="java-type" value="java-bytecode" <% if (packageType == 'java7-bytecode' || packageType == 'java8-bytecode') { %>checked<% } %> />
							Java bytecode
							<p>The package contains Java code which has been compiled (.class, .jar, or .apk files).</p>
						</label>
						<label class="checkbox" id="android-source" style="display:none">
							<input type="checkbox" <% if (packageType == 'android-source') { %>checked<% } %> />
							Android
							<p>The package contains uncompiled Java code for the Android platform.</p>
						</label>
						<label class="checkbox" id="android-bytecode" style="display:none">
							<input type="checkbox" <% if (packageType == 'android-bytecode') { %>checked<% } %> />
							Android APK
							<p>The package contains compiled Java code for the Android platform.</p>
						</label>
					</div>
				</div>
		</div>

		<div id="java-version">
			<div class="panel-group" id="java-version-info-accordion"<% if (!packageType || (packageType != 'java7-source-code' && packageType != 'java7-bytecode' && packageType != 'java8-source-code' && packageType != 'java8-bytecode')) { %> style="display:none"<% } %> />
				<br />
				<div class="panel">
					<div class="panel-heading">
						<label>
						<a data-toggle="collapse" data-parent="#java-version-info-accordion" href="#java-version-info">
							<i class="fa fa-minus-circle"></i>
							Java version
						</a>
						</label>
					</div>
					<div id="java-version-info" class="nested panel-collapse collapse in">
						<div class="radio">
							<label class="radio" id="java7">
								<input type="radio" name="java-version" value="java7" <% if (!packageType || packageType == 'java7-source-code' || packageType == 'java7-bytecode') { %>checked<% } %> />
								Java7
								<p>The package contains Java code for the Java7 platform.</p>
							</label>
							<label class="radio" id="java8">
								<input type="radio" name="java-version" value="java8" <% if (packageType == 'java8-source-code' || packageType == 'java8-bytecode') { %>checked<% } %> />
								Java8
								<p>The package contains Java code for the Java8 platform.</p>
							</label>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- python versions -->
	<div class="form-group" id="python-version" <% if (packageType != 'python2' && packageType != 'python3') { %>style="display:none"<% } %>>
		<div class="panel-group" id="python-version-info-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#python-version-info-accordion" href="#python-version-info">
						<i class="fa fa-minus-circle"></i>
						Python version
					</a>
					</label>

					<button id="show-wheel-info" class="btn" style="display:none"><i class="fa fa-circle-o"></i>Show Wheel Info</button>
				</div>

				<div id="python-version-info" class="nested panel-collapse collapse in">
					<div class="radio">
						<label class="radio" id="python2">
							<input type="radio" name="python-version" value="python2" <% if (packageType != 'python3') { %>checked<% } %> />
							Python2
							<p>The package contains Python source code in its original (2000 - 2008) dialect (version 2.x).</p>
						</label>
						<label class="radio" id="python3">
							<input type="radio" name="python-version" value="python3" <% if (packageType == 'python3') { %>checked<% } %> />
							Python3
							<p>The package contains Python source code in its most recent (2008 onwards) dialect (3.x).</p>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- ruby types -->
	<div class="form-group" id="ruby-type" <% if (!packageType || packageType.indexOf(['ruby', 'sinatra', 'rails', 'padrino']) != 0) { %>style="display:none"<% } %>>
		<div class="panel-group" id="ruby-type-info-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#ruby-type-info-accordion" href="#ruby-type-info">
						<i class="fa fa-minus-circle"></i>
						Ruby type
					</a>
					</label>
				</div>

				<div id="ruby-type-info" class="nested panel-collapse collapse in">
					<div class="radio">
						<label class="radio" id="ruby">
							<input type="radio" name="ruby-type" value="ruby" <% if (packageType != 'ruby') { %>checked<% } %> />
							Ruby
							<p>The package contains generic Ruby code.</p>
						</label>
						<label class="radio" id="ruby-sinatra">
							<input type="radio" name="ruby-type" value="sinatra" <% if (packageType == 'sinatra') { %>checked<% } %> />
							Sinatra
							<p>The package contains Ruby code using the Sinatra framework.</p>
						</label>
						<label class="radio" id="ruby-rails">
							<input type="radio" name="ruby-type" value="rails" <% if (packageType == 'rails') { %>checked<% } %> />
							Rails
							<p>The package contains Ruby code using the Rails framework.</p>
						</label>
						<label class="radio" id="ruby-padrino">
							<input type="radio" name="ruby-type" value="padrino" <% if (packageType == 'padrino') { %>checked<% } %> />
							Padrino
							<p>The package contains Ruby code using the Padrino framework.</p>
						</label>
					</div>
				</div>
			</div>
		</div>
	</div>

	<!-- web scripting types -->
	<div class="form-group" id="web-scripting-type" <% if (packageType != 'web-scripting') { %>style="display:none"<% } %>>
		<div class="panel-group" id="web-scripting-type-info-accordion">
			<div class="panel">
				<div class="panel-heading">
					<label>
					<a data-toggle="collapse" data-parent="#web-scripting-type-info-accordion" href="#web-scripting-type-info">
						<i class="fa fa-minus-circle"></i>
						Web scripting types
					</a>
					</label>
				</div>

				<div id="web-scripting-type-info" class="nested panel-collapse collapse in">
					<div class="checkbox">
						<label class="checkbox" id="html">
							<input type="checkbox" name="web-scripting-type" value="html" />
							HTML
							<p>The package contains HTML code.</p>
						</label>
						<label class="checkbox" id="javascript">
							<input type="checkbox" name="web-scripting-type" value="javscript" />
							Javascript
							<p>The package contains Javascript code.</p>
						</label>
						<label class="checkbox" id="php">
							<input type="checkbox" name="web-scripting-type" value="php" />
							PHP
							<p>The package contains PHP code.</p>
						</label>
						<label class="checkbox" id="css">
							<input type="checkbox" name="web-scripting-type" value="css" />
							CSS
							<p>The package contains CSS code.</p>
						</label>
						<label class="checkbox" id="xml">
							<input type="checkbox" name="web-scripting-type" value="xml" />
							XML
							<p>The package contains XML code.</p>
						</label>
					</div>
				</div>
		</div>
	</div>

	<p></p>
	<div align="right">
		<label><span class="required"></span>Fields are required</label>
	</div>
</form>