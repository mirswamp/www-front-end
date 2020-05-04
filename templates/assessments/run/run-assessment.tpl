<h1>
	<div class="icon"><i class="fa fa-play"></i></div>
	Add New Assessment
</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#assessments"><i class="fa fa-check"></i>Assessments</a></li>
	<li><i class="fa fa-plus"></i>Add New Assessment</li>
</ol>

<p>To create a new assessment, please specify the following information:</p>

<div class="panel" id="project-selection"<% if (!hasProjects) { %> style="display:none"<% } %>>
	<div class="panel-header">
		<h2><i class="fa fa-folder"></i>Project</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls">
			Select a <a href="#projects" target="_blank">project</a> to assess:
			<div id="project-selector"></div>
		</div>
	</div>
</div>

<div class="panel" id="package-selection">
	<div class="panel-header">
		<h2><i class="fa fa-gift"></i>Package</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls">
			Select a <a href="#packages" target="_blank">package</a> to assess:
			<div id="package-selector"></div>
		</div>
		<div class="form-group controls"<% if (package) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="package-version-selector"></div>
		</div>
	</div>
	<div style="text-align:right; margin-bottom:10px">
		<label id="include-public" class="checkbox-inline">
			<input type="checkbox"<% if (includePublic) { %> checked<% } %>/>
			Include public packages
		</label>
	</div>
</div>

<div class="panel" id="tool-selection"<% if (!package) { %> style="display:none"<% } %>>
	<div class="panel-header">
		<h2><i class="fa fa-wrench"></i>Tool</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls">
			Select a <a href="#tools/public" target="_blank">tool</a> to use:
			<div id="tool-selector"></div>
		</div>
		<div class="form-group controls"<% if (tool) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="tool-version-selector"></div>
		</div>
	</div>
</div>

<div class="panel" id="platform-selection"<% if (!package || !package.isPlatformUserSelectable()) { %> style="display:none"<% } %>>
	<div class="panel-header">
		<h2><i class="fa fa-bars"></i>Platform</h2>
	</div>
	<div class="panel-body">
		<div class="form-group controls">
			Select a <a href="#platforms/public" target="_blank">platform</a> to use:
			<div id="platform-selector"></div>
		</div>
		<div class="form-group controls"<% if (platform) { %> style="margin-left:0"<% } %>>
			Select a version:
			<div id="platform-version-selector"></div>
		</div>
	</div>
</div>

<div class="bottom buttons">
	<% var enabled = package && platform || package && !package.isPlatformUserSelectable(); %>
	<button id="save-and-run" class="btn btn-primary btn-lg"<% if (!enabled) { %> disabled<% } %>><i class="fa fa-play"></i>Save and Run</button>
	<button id="save" class="btn btn-lg"<% if (!enabled) { %> disabled<% } %>><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>
