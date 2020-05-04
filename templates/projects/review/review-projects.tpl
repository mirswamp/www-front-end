<h1><div class="icon"><i class="fa fa-folder-open"></i></div>Review Projects</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><a href="#overview"><i class="fa fa-eye"></i>System Overview</a></li>
	<li><i class="fa fa-folder-open"></i>Review Projects</li>
</ol>

<div id="project-filters"></div>
<br />

<div class="pull-right">
	<span class="required"></span>
	Limit filter includes deactivated projects.
</div>

<label>
	<input type="checkbox" id="show-deactivated-projects" <%- showDeactivatedProjects ? 'checked="checked"' : '' %>>
	Show deactivated projects
</label>

<div id="review-projects-list">
	<div class="loading">
		<i class="fa fa-spinner fa-spin"></i>
		<div class="message">Loading projects...</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>

<div class="bottom buttons">
	<button id="save" class="btn btn-primary btn-lg" disabled><i class="fa fa-save"></i>Save</button>
	<button id="cancel" class="btn btn-lg"><i class="fa fa-times"></i>Cancel</button>
</div>