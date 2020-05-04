<h1><div class="icon"><i class="fa fa-folder-open"></i></div>Projects</h1>

<ol class="breadcrumb">
	<li><a href="#home"><i class="fa fa-home"></i>Home</a></li>
	<li><i class="fa fa-folder-open"></i>Projects</li>
</ol>

<p>Projects are used to share assessment results with other SWAMP users. You can invite other users to join a project and then all members of the project can add assessments to that project and view assessment results belonging to that project. </p>

<div class="top buttons" style="margin-bottom:0">
	<button id="add-new-project" class="btn btn-primary"><i class="fa fa-plus"></i>Add New Project</button>
</div>

<div id="owned-projects">
	<h2>Projects I Own</h2>
	<div id="owned-projects-list">
		<div class="loading">
			<i class="fa fa-spinner fa-spin"></i>
			<div class="message">Loading owned projects...</div>
		</div>
	</div>
</div>

<div id="joined-projects">
	<h2>Projects I Joined</h2>
	<div id="joined-projects-list">
		<div class="loading">
			<i class="fa fa-spinner fa-spin"></i>
			<div class="message">Loading joined projects...</div>
		</div>
	</div>
</div>

<label>
	<input type="checkbox" id="show-numbering" <% if (application.options.showNumbering) { %>checked<% } %>>
	Show numbering
</label>